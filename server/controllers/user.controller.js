const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware");
const asyncHandler = require("express-async-handler");

const signin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.send({
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
    return res.status(400).send({ message: "Phone Number is already used" });
  }
  if (existsEmail.length > 0) {
    return res.status(400).send({ message: "Email is already used" });
  }
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
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const existsEmail = await User.find({ email: req.body.email });
  const existsPhoneNumber = await User.find({
    phoneNumber: req.body.phoneNumber,
  });

  if (user) {
    if (existsEmail && req.user.email !== req.body.email) {
      return res.status(400).send({ message: "Email already Exists" });
    }
    if (existsPhoneNumber && req.user.phoneNumber !== req.body.phoneNumber) {
      return res.status(400).send({ message: "Phone Number already Exists" });
    }

    const newFirstName = req.body.firstName || user.firstName;
    const newLastName = req.body.lastName || user.lastName;
    const newEmail = req.body.email || user.email;
    const newPhoneNumber = req.body.phoneNumber || user.phoneNumber;
    const newAddress = req.body.address || user.address;

    const newPassword =
      req.body.password && bcrypt.hashSync(req.body.password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phoneNumber: newPhoneNumber,
          address: newAddress,
          password: newPassword,
        },
      }
    );
    const updatedUser = await User.findById(user._id);

    return res.send({
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
  res.status(404).send({ message: "User was Not Found" });
});

const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

const singleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.send(user);
  }
  res.status(404).send({ message: "User was Not Found" });
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
    return res.send({
      message: "User Updated Successfully",
      user: updatedUser,
    });
  }
  res.status(404).send({ message: "User was Not Found" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return res
        .status(400)
        .send({ message: "Not Allowed to Delete an Admin" });
    }
    await User.findOneAndDelete({ _id: user._id });
    return res.send({ message: "User Deleted Successfully" });
  }
  res.status(404).send({ message: "User was Not Found" });
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
