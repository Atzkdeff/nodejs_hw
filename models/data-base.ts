import { Sequelize } from 'sequelize';

export const db: Sequelize = new Sequelize(
    'postgres://lgodtrgi:DJIU4ec1LWQDlOmnlYezgGcwjKK6RGvt@dumbo.db.elephantsql.com:5432/lgodtrgi',
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        },
        define: {
            timestamps: false
        }
    }
);

db.authenticate()
    .then(() => console.log('Database connection: Good'))
    .catch(() => console.log('Database connection: Bad'));
