DIST=./dist

build:
    cp package-lock.json package-lock.json.backup
	npm shrinkwrap
	npm run build
clean:
    mv package-lock.json.backup package-lock.json
	rm -rf dist
