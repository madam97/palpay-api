import { Sequelize } from 'sequelize';
import { dbConfig } from './config';

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, dbConfig.options);

sequelize.authenticate();
console.log('Connected to database...');

export default sequelize;