# 🎮 LCU Enhancement Suite

A compilation of features to enhance your League of Legends experience.

Running as a background application, found in your system tray, LCU Enhancement Suite features can be found by right clicking the application icon. 

## Features
- Quick invite recently played players
- Quick invite players by friend group
- Advanced loot disenchantment for owned & unowned resources including:
  - Champion Capsules
  - Champion Shards
  - Eternal Set Shards
  - Summoner Icons
  - Skin Shards
  - Ward Skin Shards
- Import & export friends list across accounts
- Spoof profile properties including:
 - Rank (Friends List)
 - Icon (Friends List)
- Auto accept queue prompt



## Install Dependencies
```
npm i
```
## Running the Application
### Serving Angular Live
This builds the Angular and Electron portions of the code and runs the Electron application. The Angular portion of the code is served live (i.e. from a server). Changes to both the Angular portion and the Electron portion of the code are watched and will trigger the code to be recompiled. When the Angular portion of the code is recompiled, any open Electron windows will be reloaded. When the Electron portion of the code is recompiled, a new Electron process will be spawned.
```
npm run start
```
### Serving Angular Locally
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
Alternatively, changes to the Electron portion of the code can be watched. When the Electron portion of the code is recompiled, a new Electron process will be spawned.
```
npm run electron:watch
```
## Building Executable
```
npm run package
```
