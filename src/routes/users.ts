import express, { Express } from 'express';

import { db } from 'app';

const router = express.Router();

const findUser = async ({ username, password }) => {
    let data;

    try {
        data = await db.oneOrNone(
            "SELECT username, balance FROM users WHERE username = $1 AND password = crypt($2, password)",
            [username, password]
        );
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }

    return data;
};

const createUser = async ({ username, password }) => {
    let data;
    try {
        data = await db.one(
            "INSERT INTO users (username, password) VALUES ($1, CASE WHEN LENGTH($2) >= 6 THEN crypt($2, gen_salt('bf')) ELSE NULL END); RETURNING id, username",
            [username, password]
        );
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
    return data;
};

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    const data = await findUser({ username, password });

    if (data) {
        res.status(403).json({ message: "User already exists" });
    } else {
        const data = await createUser(req.body);

        res.status(201).json(data);
    }
});

// router.get("/:userId", async (req, res) => {
//     const { userId } = req.params;
//     const data = await findUser(userId);
//     res.status(200).json(data);
// });
