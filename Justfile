# Victorem Site

set shell := ["zsh", "-cu"]

# Show available commands
list:
	@just --list

# Install dependencies
install:
	npm install

# Start local dev server
# Usage: just dev
# Default Astro port: 4321
# Use: just dev 4000

dev PORT="4321":
	npm run dev -- --host 127.0.0.1 --port {{PORT}}

# Build the production site
build:
	npm run build

# Preview the production build locally
preview PORT="4321":
	npm run preview -- --host 127.0.0.1 --port {{PORT}}

# Run a quick content check for common issues
check:
	@rg "draft: true" src/content/blog || true
	@rg "draft: true" src/content/resources || true
