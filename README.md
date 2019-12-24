# Setup
All files should be placed in the `/src/` directory.  Upon running the `npm run prepublish` command (either directly or indirectly), any files and folders under `/src/` will be sent through `babel` to the `/lib/` directory.  The `package.json` file specifies the entry point of the package to the `/lib/index.js` point.  `/lib/index.js` will be a `babel` copy of `/src/index.js`.

### Purpose of Babel
As of the time of this package, I don't know enough about how this (Node, packages, etc.) works and `babel` ensured (tested and verified) that `es6` files and structure would compile and be available *both* in a `NodeJS` level execution (i.e. an `express` sever) *and* in a `React` application.

At this point, it has not been tested with `React Native`.

# Installation
### **`npm install @lespantsfancy/lux`**
Because this is a scoped package, you must install it with the `@lespantsfancy` prefix.
|Scope|Command|
|---|---|
|Production|`npm install --save @lespantsfancy/lux`|
|Development|`npm install --save-dev @lespantsfancy/lux`|

# NPM
These are all `cli` level commands and require a terminal to execute.
## NPM Login
#### `npm login`
Follow the prompts to login with `username`, `password`, and `email`.

## NPM Packaging Commands
#### `npm version patch|minor|major`
This will increment the version of the package

#### `npm publish --access=public`
This will deploy the package to `npm`

# Commands
## Development Commands
#### `npm start`
This is a *custom script* that will run the `prepublish` command before executing `node lib/index.js`

**Command Execution Steps**

    1) `npm run prepublish`
    2) `cls`
    3) `node lib/index.js`


## Publishing Commands
#### `npm run deploy`
This is a *custom script* to both increment the `patch` and `publish` to `npm`.

**Command Execution Steps**

    1) `npm version patch`
    2) `npm publish --access=public`
       a) `babel` apparently knows to `npm run prepublish` behind the scenes here