import { Sequelize } from 'sequelize';

export const db: Sequelize = new Sequelize(process.env.DB_HOST, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    define: {
        timestamps: false
    },
    logging: false
});

db.authenticate()
    .then(() => console.log('Database connection: Good'))
    .catch(() => console.log('Database connection: Bad'));
