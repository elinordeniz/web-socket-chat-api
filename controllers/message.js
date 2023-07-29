const { StatusCodes } = require("http-status-codes");
const Message = require("../models/Message");

const getMessages = async (req, res) => {
  const recipientId = req.params?.recipientId;

  const userId = req.userId;

  const messages = await Message.find({
    sender: { $in: [recipientId, userId] },
    recipient: { $in: [recipientId, userId] },
  });

  if (messages) {
    res.status(StatusCodes.OK).json({ messages });
  } else {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Messages not received" });
  }
};

module.exports = getMessages;
