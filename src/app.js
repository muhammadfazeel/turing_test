import config from './config/index.js';
import express from 'express';
import Logger from './loaders/logger.js';
import loaders from './loaders/index.js';

// import socket from './config/socket.js';

async function startServer() {
  const app = express();
  // start by first loading all the required dependencies before listening for requests
  // see the main loader class index

  await loaders({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`Started listening on port: ${config.port}`);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();