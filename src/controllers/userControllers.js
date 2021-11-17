import brypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const register = async (req, res) => {
  const newUser = new User(req.body);
  newUser.hashed_password = brypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      user.hashed_password = undefined;
      res
        .status(201)
        .json({ user, message: "User created successfully" });
    }
  });
};

export const login = async (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      if (!user) {
        res.status(401).json({ message: "User not found" });
      } else {
        if (
          !user.comparePassword(
            req.body.password,
            user.hashed_password
          )
        ) {
          res.status(401).json({ message: "Incorrect password" });
        } else {
          user.hashed_password = undefined;
          const token = jwt.sign(
            {
              email: user.email,
              username: user.username,
              _id: user.id,
            },
            "secret",
            { expiresIn: "1h" }
          );
          res.status(200).json({
            user,
            token,
            message: "User logged in successfully",
          });
        }
      }
    }
  );
};
