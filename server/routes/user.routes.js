const express = require("express");
const {
  signin,
  signup,
  updateUser,
  allUsers,
  getUser,
} = require("../controllers/user.controller");
const { isAuth, isAdmin } = require("../middleware");
const router = express.Router();

router
  .route("/")
  .get(isAuth, isAdmin, allUsers)
  .post(signup)
  .patch(isAuth, updateUser);

router.route("/id/:id").get(isAuth, isAdmin, getUser);

router.post("/signin", signin);

module.exports = router;
