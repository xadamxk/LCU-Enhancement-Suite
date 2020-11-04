# Getting Started
## Install Dependencies
```
npm i
```
## Running the Application
### Serving Angular Live
This builds the Angular and Electron portions of the code and runs the Electron application. The Angular portion of the code is served live (i.e. from a server). This is useful when making changes to the Angular portion of the code as it will automatically recompile on changes and reload any Electron window.
```
npm run start
```
### Serving Anuglar Local
This builds the Angular and Electron portions of the code and runs the Electron application. The Angular portion of the code is served locally (i.e. from a file). This is how the application would be ran once built into an executable.
```
npm run build[:<dev|prod>]
npm run electron -- ./
```
### Skipping Angular Build
If the Angular portion of the code has not changed, or if the Angular window is not being displayed, then (re)compiling the Angular portion may be skipped.
```
npm run electron:build
npm run electron -- ./
```
## Building Executable
```
npm run package
```
