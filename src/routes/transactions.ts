import express from 'express';
import z from 'zod';

import { db } from '../app';
import { restrict, validate } from '../middlewares';

const TransactionSchema = z.object({
    body: z.object({
        receiver_username: z.string(),
        amount: z.number()
    }),
});

async function performTransaction(sender_id, receiver_username, amount) {
    let data;
    try {
        await db.tx(async t => {
            const receiver = await t.oneOrNone('SELECT id FROM users WHERE username = $1', receiver_username);

            if (!receiver) {
                throw new Error('Receiver does not exist');
            }

            const senderBalance = await t.one('SELECT balance FROM users WHERE id = $1', sender_id);
            if (+senderBalance.balance < amount) {
                throw new Error('Insufficient funds');
            }

            await t.none('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, sender_id]);
            await t.none('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, receiver.id]);
            data = await t.one('INSERT INTO transactions (sender_id, receiver_id, amount) VALUES ($1, $2, $3) RETURNING sender_id, receiver_id, amount', [sender_id, receiver.id, amount]);
        });
    } catch (error) {
        data = { error: error.message }
    }
    return data;
}

const sendFunds = async ({ sender_id, receiver_username, amount }) => {
    let data;

    try {
        data = await performTransaction(sender_id, receiver_username, amount);
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }

    return data;
};

const transactionsRouter = express.Router();

transactionsRouter.post("/", [restrict, validate(TransactionSchema)], async (req, res) => {
    const sender_id = +req.cookies.userId;
    const receiver_username = req.body.receiver_username;
    const amount = +req.body.amount;

    const data = await sendFunds({ sender_id, receiver_username, amount });

    if (data?.error) {
        res.status(200).json({ message: data?.error });
        return;
    }

    if (data !== null) {
        res.status(200).json({ message: "Transaction is successful" });
    } else {
        res.status(200).json({ message: "Something went wrong" });
    }
});

export default transactionsRouter;
