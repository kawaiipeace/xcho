import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('xcho','postgres','123456',{
    host: 'localhost',
    port: 2502,
    dialect: 'postgres',
    logging: false,
});

export default sequelize;