.PHONY: help setup dev build preview test test-browser lint format check release-prep
help: ## List commands
	@awk 'BEGIN {FS = ":.*## "} /^[a-z-]+:.*## / {printf "%-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
setup: ## Install locked development dependencies and Chromium
	npm ci
	npx playwright install chromium
dev: ## Serve editable source at localhost:5190 (refresh after edits)
	npm run dev
build: ## Produce static dist/ with fingerprinted CSS
	npm run build
preview: build ## Serve production dist/ at localhost:5190
	npm run preview
test: ## Run deterministic build and content tests
	npm test
test-browser: build ## Test desktop/mobile accessibility, navigation and capture screenshots
	npm run test:browser
lint: ## Validate HTML and check formatting
	npm run lint
format: ## Format source and tooling
	npm run format
check: lint test build ## Run local source and production checks
release-prep: check test-browser ## Prepare and verify dist/ without publishing
	@echo "Static release ready in dist/. Nothing has been published."
