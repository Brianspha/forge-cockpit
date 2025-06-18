.PHONY: format lint lint-fix check install clean build watch test package typecheck

PRETTIER_FILES = "**/*.{ts,tsx,js,jsx,vue,json,md,yml,yaml,sol}"
ESLINT_FILES = "**/*.{ts,tsx,js,jsx,vue}"

install:
	npm install
	cd src/cockpit-ui && npm install

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

build:
	npm run compile
	cd src/cockpit-ui && npm run build

watch:
	npm run watch &
	cd src/cockpit-ui && npm run start

test:
	npm run test

package:
	npm run package

clean:
	rm -rf node_modules
	rm -rf out
	rm -rf dist
	rm -rf *.vsix
	cd src/cockpit-ui && rm -rf node_modules dist