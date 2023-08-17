import express, { Express } from 'express';
import cors from 'cors'
import pgPromise from 'pg-promise';
const cookieParser = require('cookie-parser')

const { dbConfig } = require("./config");


const pgp = pgPromise({});

export const db = pgp(dbConfig);

export const app: Express = express()

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
