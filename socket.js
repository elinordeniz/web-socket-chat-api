const ws = require("ws");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const Message = require("./models/Message");
const fs = require("fs");

const createSocket = (server) => {
  const wss = new ws.WebSocketServer({ server });
  wss.on("connection", (connection, req) => {
    const notifyOnlineUsers = () => {
      [...wss.clients].forEach((client) => {
        client.send(
          JSON.stringify({
            online: [...wss.clients].map((cli) => ({
              username: cli.username,
              userId: cli.userId,
            })),
          })
        );
      });
    };
    connection.isAlive = true;
    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyOnlineUsers();
        // console.log("death");
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      // console.log("pong");
      clearTimeout(connection.deathTimer);
    });
    // console.log("connected to socket");
    wss.on("error", console.error);
    const cookies = req.headers.cookie;
    if (cookies) {
      const headerCookies = cookies
        .split(";")
        .find((st) => st.startsWith("token="));
      if (headerCookies) {
        const token = headerCookies.split("=")[1];
        if (token) {
          jwt.verify(
            token,
            process.env.JWT_SECRET_KEY,
            {},
            (error, decoded) => {
              if (error) {
                return res
                  .status(StatusCodes.UNAUTHORIZED)
                  .json({ message: error });
              }
              const { userId, username } = decoded;
              connection.userId = userId;
              connection.username = username;
            }
          );
        }
      }
    }

    connection.on("message", async (message) => {
      messageData = JSON.parse(message.toString());

      const { recipient, text, file } = messageData;
      let fileName = null;
      if (file) {
        const parts = file.name.split(".");
        const ext = parts[parts.length - 1];
        fileName = Date.now() + "." + ext;
        const path = __dirname + "/uploads/" + fileName;
        const bufferData = Buffer.from(file.data.split(",")[1], "base64");
        fs.writeFile(path, bufferData, () => {
          // console.log("file saved");
        });
      }
      if (recipient && (text || file)) {
        const messageDB = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          file: file ? fileName : null,
        });
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                _id: messageDB._id,
                file: file ? fileName : null,
              })
            )
          );
      }
    });

    notifyOnlineUsers();
  });
};

module.exports = createSocket;
