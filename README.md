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