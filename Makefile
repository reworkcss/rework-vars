all: install test

install:
	@ npm install

test:
	@ ./node_modules/.bin/mocha --slow 30 --reporter spec

.PHONY: all install test
