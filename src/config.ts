import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
};

const serverPort = process.env.SERVER_PORT;

module.exports = { dbConfig, serverPort };