import { Injectable } from '@angular/core';
import * as cp from 'child_process';
import { ipcRenderer, remote, webFrame } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  cp: typeof cp;
  fs: typeof fs;
  path: typeof path;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.cp = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }
}
