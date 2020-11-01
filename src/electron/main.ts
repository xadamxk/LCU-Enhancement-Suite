import { dialog, MessageBoxSyncOptions } from 'electron';
import { ClientNotFoundError, CredentialsNotFoundError } from '../connector';
import { Module } from './api';
import { app } from './core';
import { modules } from './modules';

app.init(process.env.NODE_ENV !== 'e2e');

app.on('init-error', error => {
  const options: MessageBoxSyncOptions = {
    type: 'error',
    title: 'Initialization Error',
    message: 'Failed to initialize.'
  };

  if (error instanceof ClientNotFoundError) {
    options.detail = 'League Client was not found. Confirm the client is running.';
  } else if (error instanceof CredentialsNotFoundError) {
    options.detail = 'League Client credentials were not found. Restart the client.';
  }

  dialog.showMessageBoxSync(null, options);
});

app.on('init-finished', () => {
  modules.forEach((module: Module) => {
    module.register();
  });
});
