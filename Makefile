.PHONY: format lint lint-fix check install clean build watch test package typecheck package-ext publish-ext bump-patch bump-minor bump-major push release-github publish-vsce release-patch release-minor release-major release

PRETTIER_FILES = "**/*.{ts,tsx,js,jsx,vue,md,yml,yaml,sol}" "**/*.json" "!**/package-lock.json" "!**/yarn.lock" "!**/pnpm-lock.yaml"
ESLINT_FILES = "**/*.{ts,tsx,js,jsx,vue,yml,yaml,json,sol}"

install:
	npm install --legacy-peer-deps
	cd src/cockpit-ui && npm install --legacy-peer-deps

format:
	npx prettier --write $(PRETTIER_FILES)
	cd src/cockpit-ui && npx prettier --write $(PRETTIER_FILES)

format-check:
	@echo "Checking code formatting..."
	@echo "Root directory:"
	npx prettier --list-different $(PRETTIER_FILES) || (echo "Files above need formatting. Run 'make format' to fix." && exit 1)
	@echo "Cockpit UI directory:"
	cd src/cockpit-ui && npx prettier --list-different $(PRETTIER_FILES) || (echo "Files above need formatting. Run 'make format' to fix." && exit 1)
	@echo "All files are properly formatted!"

lint:
	@echo "Running ESLint on root directory..."
	npx eslint $(ESLINT_FILES) || (echo "Linting errors found above. Run 'make lint-fix' to auto-fix some issues." && exit 1)
	@echo "Running ESLint on cockpit-ui directory..."
	cd src/cockpit-ui && npx eslint $(ESLINT_FILES) || (echo "Linting errors found above. Run 'make lint-fix' to auto-fix some issues." && exit 1)
	@echo "All files pass linting!"

lint-fix:
	@echo "Auto-fixing linting issues..."
	npx eslint $(ESLINT_FILES) --fix
	cd src/cockpit-ui && npx eslint $(ESLINT_FILES) --fix
	@echo "Auto-fix complete. Check remaining issues with 'make lint'"

typecheck:
	@echo "Running TypeScript type checking..."
	npx tsc --noEmit || (echo "TypeScript errors found above. Fix type errors before proceeding." && exit 1)
	cd src/cockpit-ui && npm run typecheck || (echo "TypeScript errors found in cockpit-ui above." && exit 1)
	@echo "All TypeScript checks passed!"

check: format-check lint typecheck

build: install
	cd src/cockpit-ui && npm run build
	npm run compile

watch:
	npm run dev

test:
	npm run test

package: build
	npm run package

clean:
	rm -rf node_modules
	rm -rf out
	rm -rf dist
	rm -rf *.vsix
	cd src/cockpit-ui && rm -rf node_modules dist build

bump-patch:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	$(eval NEW_VERSION := $(shell node -e "const semver = require('semver'); console.log(semver.inc('$(CURRENT_VERSION)', 'patch'))"))
	npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	cd src/cockpit-ui && npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	git add .
	git commit -m "chore: bump version to v$(NEW_VERSION)"

bump-minor:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	$(eval NEW_VERSION := $(shell node -e "const semver = require('semver'); console.log(semver.inc('$(CURRENT_VERSION)', 'minor'))"))
	npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	cd src/cockpit-ui && npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	git add .
	git commit -m "chore: bump version to v$(NEW_VERSION)"

bump-major:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	$(eval NEW_VERSION := $(shell node -e "const semver = require('semver'); console.log(semver.inc('$(CURRENT_VERSION)', 'major'))"))
	npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	cd src/cockpit-ui && npm version $(NEW_VERSION) --no-git-tag-version --allow-same-version
	git add .
	git commit -m "chore: bump version to v$(NEW_VERSION)"

bump-version: bump-minor

push:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	git tag v$(CURRENT_VERSION)
	git push origin main --tags

release-github:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	gh release create v$(CURRENT_VERSION) --title "v$(CURRENT_VERSION)" --notes "Release v$(CURRENT_VERSION) with bug fixes"

package-ext: build
	npx @vscode/vsce package

publish-vsce: build
	npx @vscode/vsce publish

publish-ext: publish-vsce

release-patch: clean install bump-patch push publish-vsce release-github

release-minor: clean install bump-minor push publish-vsce release-github

release-major: clean install bump-major push publish-vsce release-github

release: release-patch

dev-setup: install

pre-publish: clean install check build package-ext

dev: clean install build watch