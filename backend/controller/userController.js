const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware");
const asyncHandler = require("express-async-handler");

const signin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: "Incorrect email or password" });
});

const signup = asyncHandler(async (req, res) => {
  const existsPhoneNumber = await User.find({
    phoneNumber: req.body.phoneNumber,
  });
  const existsEmail = await User.find({
    email: req.body.email,
  });

  if (existsPhoneNumber.length > 0) {
    res.status(400).send({ message: "Phone Number is already used" });
  } else if (existsEmail.length > 0) {
    res.status(400).send({ message: "Email is already used" });
  } else {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      password: bcrypt.hashSync(req.body.password),
    });

    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  const existsEmail = await User.find({ email: req.body.email });
  const existsPhoneNumber = await User.find({
    phoneNumber: req.body.phoneNumber,
  });

  if (user) {
    if (existsEmail.length > 0 && user.email !== req.body.email) {
      res.status(400).send({ message: "Email already Exists" });
    } else if (existsPhoneNumber.length > 0 && user.email !== req.body.email) {
      res.status(400).send({ message: "Phone Number already Exists" });
    } else {
      const newPassword =
        req.body.password && bcrypt.hashSync(req.body.password, 10);

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            password: newPassword,
          },
        }
      );

      const updatedUser = await User.findById(user._id);

      res.send({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  } else {
    res.status(404).send({ message: "User was Not Found" });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

const singleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: "User was Not Found" });
  }
});

const updateSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        },
      }
    );

    const updatedUser = await User.findById(user._id);
    res.send({ message: "User Updated Successfully", user: updatedUser });
  } else {
    res.status(404).send({ message: "User was Not Found" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400).send({ message: "Not Allowed to Delete an Admin" });
      return;
    }
    await User.findOneAndDelete({ _id: user._id });
    res.send({ message: "User Deleted Successfully" });
  } else {
    res.status(404).send({ message: "User was Not Found" });
  }
});

module.exports = {
  signin,
  signup,
  updateUser,
  allUsers,
  singleUser,
  updateSingleUser,
  deleteUser,
};
