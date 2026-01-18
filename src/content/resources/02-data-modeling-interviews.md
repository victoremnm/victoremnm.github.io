---
title: "Data Modeling for Interviews: Facts, Dimensions & Design Patterns"
description: "A practical guide to dimensional modeling questions in data engineering interviews - star schemas, SCD types, and design exercises."
date: 2025-01-17
tags: ["interviews", "data-engineering", "data-modeling", "dimensional-modeling"]
draft: false
---

# Data Modeling for Interviews: Facts, Dimensions & Design Patterns

*A practical guide to dimensional modeling questions in data engineering interviews*

---

## Why Data Modeling Matters

In data engineering interviews, you'll be asked to design schemas for real-world scenarios. This tests whether you can:

1. Translate business requirements into data structures
2. Balance normalization vs query performance
3. Handle slowly changing data appropriately
4. Think about how analysts will actually use your models

> **Victor's Take:** Data modeling questions separate "I can write SQL" from "I can design systems analysts love to use." The best candidates think about the end user—the analyst writing queries at 2am trying to answer a business question.

---

## The Three Modeling Philosophies

Before diving into techniques, understand the tradeoffs:

| Approach | Description | When to Use |
|----------|-------------|-------------|
| **Kimball (Star Schema)** | Denormalized facts + dimensions | Analytics, BI dashboards, known query patterns |
| **Relational (3NF)** | Normalized, minimal redundancy | OLTP systems, when data integrity is paramount |
| **One Big Table (OBT)** | Fully denormalized single table | Simple analytics, small datasets, prototyping |

### Quick Decision Framework

```
Is query performance critical?
  → Yes: Kimball or OBT
  → No: Relational might be fine

Are query patterns known in advance?
  → Yes: Kimball (optimize for those patterns)
  → No: Relational (flexibility for unknown queries)

Is the dataset small (<1M rows)?
  → Yes: OBT is often fine
  → No: Consider Kimball for better performance
```

> **Victor's Take:** Don't default to "always Kimball" or "always normalized." State your assumptions and explain the tradeoff. Interviewers want to see you think, not recite.

---

## Star Schema Fundamentals

The core building blocks:

### Fact Tables

- Contain **measurements/metrics** (quantities, amounts, counts)
- Have **foreign keys** to dimension tables
- Are typically **append-only** (events don't change)
- Granularity is crucial—one row = one event/transaction

**Example: Sales Fact**
```sql
CREATE TABLE fact_sales (
    sale_id         BIGINT PRIMARY KEY,
    date_key        INT REFERENCES dim_date(date_key),
    product_key     INT REFERENCES dim_product(product_key),
    customer_key    INT REFERENCES dim_customer(customer_key),
    store_key       INT REFERENCES dim_store(store_key),

    -- Measures
    quantity        INT,
    unit_price      DECIMAL(10,2),
    total_amount    DECIMAL(10,2),
    discount_amount DECIMAL(10,2)
);
```

### Dimension Tables

- Contain **descriptive attributes** (who, what, where, when)
- Have a **surrogate key** (not the business key)
- Change over time (hence SCD patterns)
- Are **denormalized** for query convenience

**Example: Product Dimension**
```sql
CREATE TABLE dim_product (
    product_key     INT PRIMARY KEY,          -- Surrogate key
    product_id      VARCHAR(50),              -- Business key
    product_name    VARCHAR(200),
    category        VARCHAR(100),
    subcategory     VARCHAR(100),
    brand           VARCHAR(100),

    -- SCD Type 2 columns
    effective_date  DATE,
    expiration_date DATE,
    is_current      BOOLEAN
);
```

---

## Slowly Changing Dimensions (SCD)

This is where most candidates struggle. Know Types 1, 2, and 3 cold.

### SCD Type 1: Overwrite

**What:** Simply update the old value with the new value.

**When:** History doesn't matter (e.g., fixing a typo).

```sql
-- Customer changes email
UPDATE dim_customer
SET email = 'new@email.com'
WHERE customer_id = 'C123';
```

**Tradeoff:** You lose history. All historical facts will join to the new value.

### SCD Type 2: Add New Row

**What:** Keep full history by adding a new row for each change.

**When:** History matters for analysis (e.g., customer changed regions).

```sql
-- Customer moved from NYC to LA
-- Step 1: Expire the old record
UPDATE dim_customer
SET expiration_date = '2024-01-14', is_current = FALSE
WHERE customer_id = 'C123' AND is_current = TRUE;

-- Step 2: Insert new record
INSERT INTO dim_customer (customer_key, customer_id, city, effective_date, expiration_date, is_current)
VALUES (new_surrogate_key, 'C123', 'Los Angeles', '2024-01-15', '9999-12-31', TRUE);
```

**Tradeoff:** Table grows. Joins are slightly more complex. But you can answer "What region was the customer in when they made this purchase?"

### SCD Type 3: Add Column

**What:** Keep current + one previous value in separate columns.

**When:** You only need limited history (e.g., current vs previous).

```sql
CREATE TABLE dim_customer (
    customer_key    INT PRIMARY KEY,
    customer_id     VARCHAR(50),
    current_city    VARCHAR(100),
    previous_city   VARCHAR(100),
    city_change_date DATE
);
```

**Tradeoff:** Limited history. Simpler than Type 2 but less flexible.

### Quick Reference

| Type | History | Complexity | Use Case |
|------|---------|------------|----------|
| Type 1 | None | Low | Corrections, immutable attributes |
| Type 2 | Full | High | Accurate historical reporting |
| Type 3 | Limited (current + previous) | Medium | When only "before/after" matters |

> In interviews, default to discussing Type 2 for important attributes. It shows you understand the value of historical accuracy. Then mention "for less critical attributes, Type 1 is fine to avoid complexity."

---

## Practice Exercise: Design a Ride-Sharing Data Model

This is a classic interview question. Design the data model for a service like Uber.

### Requirements

- Track all rides (completed, cancelled, in-progress)
- Support metrics: rides per day, revenue, driver utilization
- Enable analysis by time, location, driver, rider

### Step 1: Identify the Grain

**Grain = One ride**

Every row in the fact table represents one ride request.

### Step 2: Identify Dimensions

| Dimension | Key Attributes |
|-----------|---------------|
| **Time** | date, hour, day_of_week, is_holiday |
| **Location (Pickup)** | city, neighborhood, lat/long |
| **Location (Dropoff)** | city, neighborhood, lat/long |
| **Driver** | driver_id, name, vehicle_type, rating, tenure |
| **Rider** | rider_id, name, signup_date, lifetime_rides |
| **Ride Type** | UberX, UberXL, UberBlack, etc. |

### Step 3: Identify Facts (Measures)

- ride_duration_minutes
- ride_distance_miles
- fare_amount
- tip_amount
- surge_multiplier
- wait_time_minutes

### Step 4: Design the Schema

```sql
-- Fact Table
CREATE TABLE fact_rides (
    ride_id             BIGINT PRIMARY KEY,
    request_timestamp   TIMESTAMP,

    -- Dimension keys
    date_key            INT REFERENCES dim_date,
    pickup_location_key INT REFERENCES dim_location,
    dropoff_location_key INT REFERENCES dim_location,
    driver_key          INT REFERENCES dim_driver,
    rider_key           INT REFERENCES dim_rider,
    ride_type_key       INT REFERENCES dim_ride_type,

    -- Status
    ride_status         VARCHAR(20),  -- requested, accepted, in_progress, completed, cancelled

    -- Measures
    ride_duration_min   DECIMAL(10,2),
    ride_distance_mi    DECIMAL(10,2),
    fare_amount         DECIMAL(10,2),
    tip_amount          DECIMAL(10,2),
    surge_multiplier    DECIMAL(4,2),
    wait_time_min       DECIMAL(10,2)
);

-- Date Dimension (always have this)
CREATE TABLE dim_date (
    date_key        INT PRIMARY KEY,
    full_date       DATE,
    day_of_week     VARCHAR(10),
    day_of_month    INT,
    month           INT,
    quarter         INT,
    year            INT,
    is_weekend      BOOLEAN,
    is_holiday      BOOLEAN
);

-- Driver Dimension (SCD Type 2 for rating changes)
CREATE TABLE dim_driver (
    driver_key      INT PRIMARY KEY,
    driver_id       VARCHAR(50),
    driver_name     VARCHAR(200),
    vehicle_type    VARCHAR(50),
    vehicle_year    INT,
    driver_rating   DECIMAL(3,2),
    driver_tenure_days INT,

    -- SCD Type 2
    effective_date  DATE,
    expiration_date DATE,
    is_current      BOOLEAN
);
```

### Step 5: Sample Queries This Supports

```sql
-- Daily completed rides by city
SELECT
    d.full_date,
    pl.city,
    COUNT(*) as rides,
    SUM(f.fare_amount) as revenue
FROM fact_rides f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_location pl ON f.pickup_location_key = pl.location_key
WHERE f.ride_status = 'completed'
GROUP BY d.full_date, pl.city;

-- Driver utilization (% of time with passenger)
SELECT
    dr.driver_id,
    dr.driver_name,
    SUM(f.ride_duration_min) / (COUNT(DISTINCT d.full_date) * 8 * 60) as utilization_pct
FROM fact_rides f
JOIN dim_driver dr ON f.driver_key = dr.driver_key
JOIN dim_date d ON f.date_key = d.date_key
WHERE dr.is_current = TRUE
GROUP BY dr.driver_id, dr.driver_name;
```

> **Victor's Take:** When presenting your design, always show 2-3 example queries it enables. This proves you thought about the end user.

---

## Common Interview Questions & Answers

### Q: "Why use surrogate keys instead of natural keys?"

**Answer:**
1. **Stability:** Natural keys can change (customer email, product SKU)
2. **Performance:** Integer keys are faster to join than strings
3. **SCD support:** Surrogate keys let you have multiple rows per natural key (Type 2)
4. **Integration:** Same natural key from different systems might mean different things

### Q: "When would you NOT use a star schema?"

**Answer:**
1. **OLTP systems** — Need normalized structure for write performance
2. **Unknown query patterns** — Highly flexible ad-hoc analysis might prefer normalized
3. **Very small datasets** — OBT is simpler and fast enough
4. **Real-time streaming** — Event-sourcing patterns might be more appropriate

### Q: "How do you handle late-arriving facts?"

**Answer:**
1. Use the **event timestamp** for the date dimension, not load timestamp
2. Design dimensions to have rows available for historical dates
3. For SCD Type 2, use the fact's event date to join to the correct dimension row
4. Consider **Type 4** (mini-dimensions) for rapidly changing attributes

---

## Video & Reading Resources

| Resource | Link | Focus |
|----------|------|-------|
| SCD Deep Dive | [Slowly Changing Dimensions for Data Engineers](https://youtu.be/1FZ7et0pN4c) | Type 1, 2, 3 with examples |
| Architecture Tradeoffs | [OBT vs Kimball vs Relational](https://youtu.be/ltQgbSs99WU) | When to use each approach |
| Uber Exercise | [Data Modeling: Taxi Service](https://medium.com/towards-data-engineering/data-modelling-design-the-data-model-for-a-taxi-service-like-uber-eaedfa0e25f4) | Practice problem |
| Kimball Book (Ch 1-2) | [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/) | Foundational reading |

---

## Key Takeaways

1. **State your grain first** — Everything else flows from "one row = one X"
2. **Know SCD types cold** — Type 2 is the default for important attributes
3. **Think about the analyst** — Design for the queries they'll write
4. **Explain tradeoffs** — There's no perfect answer, only good reasoning
5. **Draw it out** — Interviewers love to see you sketch the schema

> **Final Victor's Take:** The best data models are boring. They're predictable, consistent, and let analysts focus on insights instead of fighting the schema. If you're explaining clever workarounds, you've probably over-engineered it.

---

*Previous: [Data Engineering Metrics Interview Guide](./01-data-engineering-metrics-interview-guide.md)*
*Next: [Behavioral Questions with the SCORE Framework](./03-behavioral-score-framework.md)*
