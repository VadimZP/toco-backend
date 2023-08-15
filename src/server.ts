const { app, db } = require("./app");
const { serverPort } = require("./config");

const users = require("./routes/users");
const transactions = require("./routes/transactions");

app.use("/users", users);
app.use("/transactions", transactions);

// function errorHandler(err, req, res, next) {
//   res.status(500).json({ message: "Server error" });
// }

// app.use(errorHandler);

app.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});