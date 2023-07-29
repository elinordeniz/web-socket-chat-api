require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const connectDB = require("./db/connect");

const createSocket = require("./socket");

const app = express();
const PORT = process.env.PORT || 4000;

const authRouter = require("./routers/auth");
const messageRouter = require("./routers/message");
const usersRouter = require("./routers/users");

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/uploads",express.static(__dirname+"/uploads"));

//Routes
app.get("/", (req, res) => {
  res.json("main page");
});

app.use("/auth", authRouter);
app.use("/messages", messageRouter);
app.use("/users", usersRouter);

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI).then(() => {
      server = app.listen(PORT, () =>
        console.log(`App is listening on PORT ${PORT}`)
      );
      createSocket(server);
    });
  } catch (err) {
    console.log(err);
   res.status(500).json({ "message": err });
  }
};

start();
