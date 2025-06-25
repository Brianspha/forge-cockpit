.PHONY: format lint lint-fix check install clean build watch test package typecheck package-ext publish-ext bump-patch bump-minor bump-major push release-github publish-vsce release-patch release-minor release-major release

PRETTIER_FILES = "**/*.{ts,tsx,js,jsx,vue,json,md,yml,yaml,sol}"
ESLINT_FILES = "**/*.{ts,tsx,js,jsx,vue}"

install:
	npm install --legacy-peer-deps
	cd src/cockpit-ui && npm install --legacy-peer-deps

format:
	npx prettier --write $(PRETTIER_FILES)
	cd src/cockpit-ui && npx prettier --write $(PRETTIER_FILES)

format-check:
	@echo "Checking code formatting..."
	@npx prettier --check $(PRETTIER_FILES) --list-different || (echo "Files with formatting issues above ↑" && exit 1)
	@cd src/cockpit-ui && npx prettier --check $(PRETTIER_FILES) --list-different || (echo "Files with formatting issues in cockpit-ui above ↑" && exit 1)
	@echo "All files are properly formatted!"

lint:
	npx eslint $(ESLINT_FILES)
	cd src/cockpit-ui && npx eslint $(ESLINT_FILES)

lint-fix:
	npx eslint $(ESLINT_FILES) --fix
	cd src/cockpit-ui && npx eslint $(ESLINT_FILES) --fix

typecheck:
	npx tsc --noEmit
	cd src/cockpit-ui && npm run typecheck

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
	gh release create v$(CURRENT_VERSION) --title "v$(CURRENT_VERSION)" --notes "Release v$(CURRENT_VERSION)"

package-ext: build
	npx @vscode/vsce package

publish-vsce: build
	npx @vscode/vsce publish

publish-ext: publish-vsce

release-patch: bump-patch push publish-vsce release-github

release-minor: bump-minor push publish-vsce release-github

release-major: bump-major push publish-vsce release-github

release: release-minor

dev-setup: install

pre-publish: clean install check build package-ext

dev: clean install build watch