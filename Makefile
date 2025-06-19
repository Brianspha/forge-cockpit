.PHONY: format lint lint-fix check install clean build watch test package typecheck package-ext publish-ext bump-version push release-github publish-vsce release

PRETTIER_FILES = "**/*.{ts,tsx,js,jsx,vue,json,md,yml,yaml,sol}"
ESLINT_FILES = "**/*.{ts,tsx,js,jsx,vue}"

install:
	npm install --legacy-peer-deps
	cd src/cockpit-ui && npm install --legacy-peer-deps

format:
	npx prettier --write $(PRETTIER_FILES)
	cd src/cockpit-ui && npx prettier --write $(PRETTIER_FILES)

format-check:
	npx prettier --check $(PRETTIER_FILES)
	cd src/cockpit-ui && npx prettier --check $(PRETTIER_FILES)

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

bump-version:
	npm version minor --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json package-lock.json
	git commit -m "chore: bump version to v$(NEW_VERSION)"

push:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	git tag v$(CURRENT_VERSION)
	git push origin main --tags

release-github:
	$(eval CURRENT_VERSION := $(shell node -p "require('./package.json').version"))
	gh release create v$(CURRENT_VERSION) --title "v$(CURRENT_VERSION)" --notes "Release v$(CURRENT_VERSION)"

package-ext: build
	vsce package

publish-vsce: build
	vsce publish

publish-ext: publish-vsce

release: bump-version push publish-vsce release-github

dev-setup: install

pre-publish: clean install check build package-ext

dev: clean install build watch