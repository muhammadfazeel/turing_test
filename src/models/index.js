import Sequelize from 'sequelize';
import config from '../config/config.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// connect to sql db
const sequelize = new Sequelize(
  process.env.database,
  process.env.username,
  process.env.password,
  {
    dialect: 'mysql',
    port: 3306,
    host: process.env.host,
    logging: false,
    models: [__dirname]
  },
);

export default sequelize;