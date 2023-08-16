import express, { Express } from 'express';
import cors from 'cors'
import pgPromise from 'pg-promise';

const { dbConfig } = require("./config");

const pgp = pgPromise({});
export const db = pgp(dbConfig);

export const app: Express = express()

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
