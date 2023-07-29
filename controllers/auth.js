const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username or password missing!" });
  }

  const duplicate = await User.findOne({ username });
  if (duplicate) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Username already exists!" });
  }
  const user = await User.create({ username, password });
  jwt.sign(
    { userId: user._id, username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "9000s" },
    (err, token) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err });

      res
        .cookie("token", token, { httpOnly: true, secure: true })
        .status(StatusCodes.CREATED)
        .json({ id: user._id });
    }
  );
};

const profile = (req, res) => {
  return res
    .status(StatusCodes.OK)
    .json({ username: req.username, userId: req.userId });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User not found please register!" });
  } else if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      jwt.sign(
        { username, userId: user._id },
        process.env.JWT_SECRET_KEY,
        {},
        (err, token) => {
          if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: err });
          }
          res.cookie("token", token).json({ id: user._id });
        }
      );
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Incorrect Password" });
    }
  }
};

const logout = (req, res) => {
  // const token = req.cookie?.token;
  // if (!token) {
  //   return res.status(StatusCodes.NO_CONTENT);
  // }
  res.cookie("token", "", { httpOnly: true });
  res.sendStatus(StatusCodes.NO_CONTENT);
};
module.exports = { register, login, profile, logout };
