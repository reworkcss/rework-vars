test: install
	@ ./node_modules/.bin/mocha --slow 30 --reporter spec

install:
	@ npm install

.PHONY: test install
