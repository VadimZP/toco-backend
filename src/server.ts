import { app } from "./app";
import { serverPort } from "./config";
import usersRouter from "./routes/users";
import transactionsRouter from "./routes/transactions";

app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

// function errorHandler(err, req, res, next) {
//   res.status(500).json({ message: "Server error" });
// }

// app.use(errorHandler);

app.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});