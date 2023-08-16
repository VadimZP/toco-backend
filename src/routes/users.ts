import express from 'express';
import z from 'zod';

import { db } from '../app';
import { validate } from '../middlewares';

const SignInSchema = z.object({
    body: z.object({
        username: z.string().min(2).max(18),
        password: z.string().min(6),
    }),
});

const getUserInfoSchema = z.object({
    params: z.object({
        userId: z.number()
    })
})


const getUserById = async ({ userId }) => {
    let data;

    try {
        data = await db.oneOrNone(
            "SELECT id, username, balance, created_at FROM users WHERE id = $1",
            [userId]
        );
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }

    return data;
};

const getUserByUsernameAndPass = async ({ username, password }) => {
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
            "INSERT INTO users (username, password) VALUES ($1, crypt($2, gen_salt('bf'))) RETURNING id, username",
            [username, password]
        );
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
    return data;
};

const usersRouter = express.Router();

usersRouter.post("/", validate(SignInSchema), async (req, res) => {
    const { username, password } = req.body;

    const data = await getUserByUsernameAndPass({ username, password });

    if (data !== null) {
        res.status(403).json({ message: "User already exists" });
    } else {
        const data = await createUser(req.body);

        res.status(201).json(data);
    }
});

usersRouter.get("/:userId", async (req, res) => {
    const userId = +req.params.userId;

    try {
        getUserInfoSchema.parse({
            params: { userId },
        });

        const data = await getUserById({ userId });

        if (data !== null) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        if (error?.errors[0]?.code === 'invalid_type') {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(400).send(error);
        }
    }
});

export default usersRouter;
