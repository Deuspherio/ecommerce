const express = require("express");
const {
  signin,
  signup,
  updateUser,
  allUsers,
  deleteUser,
  singleUser,
  updateSingleUser,
} = require("../controller/userController");
const { isAuth, isAdmin } = require("../middleware");
const router = express.Router();

router.get("/", isAuth, isAdmin, allUsers);
router.post("/signin", signin);
router.post("/signup", signup);
router.put("/update-profile", isAuth, updateUser);
router.delete("/delete/:id", isAuth, isAdmin, deleteUser);
router.get("/id/:id", isAuth, isAdmin, singleUser);
router.put("/id/:id", isAuth, isAdmin, updateSingleUser);

module.exports = router;
