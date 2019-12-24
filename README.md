# Setup
All files should be placed in the `/src/` directory.  Upon running the `npm run prepublish` command (either directly or indirectly), any files and folders under `/src/` will be sent through `babel` to the `/lib/` directory.  The `package.json` file specifies the entry point of the package to the `/lib/index.js` point.  `/lib/index.js` will be a `babel` copy of `/src/index.js`.

# Installation
### **`@lespantsfancy/lux`**
Because this is a scoped package, you must install it with the `@lespantsfancy` prefix.
|Scope|Command|
|---|---|
|Production|`npm install --save @lespantsfancy/lux`|
|Development|`npm install --save-dev @lespantsfancy/lux`|
|Generic|`npm install @lespantsfancy/lux`|

# Commands
#### `npm start`
This will run the `npm run prepublish` command, `cls` the screen, then execute `node lib/index.js`

#### `npm run deploy`
This will update the **patch** of the build via `npm version patch`, and will the run the `npm publish --access=public` command.  Behind the scenes, the `prepublish` command will be run automatically.

## NPM Packaging Commands
* `npm version patch|minor|major`
* `npm publish --access=public`

## Build & Publish Commands
* `npm run deploy`

## Development Commands
* `npm start`