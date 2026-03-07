var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var User = require('../Modals/Users.js')
var Report = require("../Modals/Reports.js")
var Groups = require("../Modals/Groups.js")
var userHelper = require("../helper/userHelpers.js")
var auth = require('../middleware/auth.js')
var Message = require("../Modals/Message.js")
const upload = require("../middleware/reportUploads.js");
const { apiLimiter, authLimiter } = require("../middleware/rateLimiter");

/* GET home page. */

router.post('/signup', authLimiter, async function(req, res, next) {
  try {
    const user = req.body;

    if (!user || !user.email || !user.password) {
      return res.status(400).json({
        status: false,
        msg: "All fields are required"
      });
    }

    // ✅ Check if email exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        msg: "Email Already Exists!!"
      });
    }
    var hashedPassword = await bcrypt.hash(user.password, 10)
    console.log(user)
    const newUser = new User({
      ...user,
      pass: hashedPassword
    });
    newUser.save().then(() => {
      res.status(200).json({ status: true, msg: "SignUp Succesfull" })
    }).catch(() => {
      res.status(400).json({ status: false, msg: "Something Went Wrong Try Again !!" });

    })
  } catch (error) {
    res.status(400).json({ status: false, msg: "SignUp Failed. Try Again!!" });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    console.log(req.body)
    let user = await User.findOne({ email: req.body.email })

    console.log("user", user)

    if (!user) {
      return res.status(400).json({ status: false, msg: "User Not Found" })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.pass)
    if (!isMatch) {
      return res.status(400).json({ status: false, msg: "Invalid or Wrong password" })
    }

    req.session.user = user._id
    req.session.save(() => {
      res.status(200).json({ status: true, msg: "Logged in Succesfull" });
    })
  } catch (error) {
    console.error("err", error)
    res.status(500).json({ status: false, msg: "Login Falied" })
  }
})

router.get("/me", auth, async (req, res) => {
  const existingUser = await User.findById(req.session.user).select("-pass");

  if (!existingUser) {
    res.status(400).json({ status: false, msg: "User Not Found" })
  }
  res.status(200).json({ status: true, user: existingUser });
})

router.post("/topcards", auth, async (req, res) => {
  userHelper.getTopCards(req.session.user).then((cards) => {
    console.log(cards);
    res.status(200).json({ cards });
  }).catch(() => {
    res.status(400).json({ status: false, nsg: "Cannot get cards" })
  })
})

router.post("/joined-groups", auth, (req, res) => {
  userHelper.getJoinedGroups(req.session.user).then((groups) => {
    console.log(groups);
    res.status(200).json({ groups })
  }).catch(() => {
    res.status(400).json({ status: false, msg: "something went wrong !!" })
  })
})

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({
      status: false,
      msg: "No active session"
    });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: false,
        msg: "Logout failed"
      });
    }

    res.clearCookie("connect.sid"); // default session cookie name

    return res.status(200).json({
      status: true,
      msg: "Logged out successfully"
    });
  });
});

//================ REPORT BY USER ==============================


router.post(
  "/reports",
  auth,
  apiLimiter,
  upload.array("evidence", 5),
  async (req, res) => {
    try {

      const { targetType, targetId, reason, description } = req.body;

      if (!targetType || !targetId || !reason)
        return res.status(400).json({ message: "Missing fields" });

      const existing = await Report.findOne({
        reporter: req.session.user,
        targetId
      });

      if (existing)
        return res.status(400).json({ message: "Already reported" });

      let snapshot = {};

      /* GROUP SNAPSHOT */

      if (targetType === "group") {

        const group = await Groups.findById(targetId)
          .populate("createdBy", "name");

        snapshot = {
          title: group.groupName,
          text: group.description,
          owner: group.createdBy?.name,
          ownerId: group.createdBy?._id
        };
      }

      /* USER SNAPSHOT */

      if (targetType === "user") {

        const user = await User.findById(targetId);

        snapshot = {
          title: user.name,
          text: user.email,
          owner: user.name,
          ownerId: user._id
        };
      }

      /* MESSAGE SNAPSHOT */

      if (targetType === "message") {

        const message = await Message.findById(targetId)
          .populate("sender", "name");

        snapshot = {
          owner: message.sender?.name,
          ownerId: message.sender?._id,
          messageId: message._id,
          messageText: message.text
        };
      }

      const evidenceImages = req.files?.map(
        (file) => file.filename
      );

      const report = await Report.create({

        reporter: req.session.user,
        targetType,
        targetId,

        reason,
        description,

        snapshot,

        evidenceImages
      });

      res.json({ success: true, report });

    } catch (err) {

      res.status(500).json({ error: err.message });

    }
  }
);

// GET PROFILE

router.get("/profile", auth, async (req, res) => {

  try {

    const user = await User.findById(req.session.user).select("-pass");

    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      status: false,
      msg: "Error fetching profile"
    });

  }

});

router.put("/profile/:id", auth, async (req, res) => {
  try {
    if (req.params.id !== String(req.session.user)) {
      return res.status(403).json({ error: "Forbidden: Not your profile" });
    }

    const { name, bio, subjects } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        bio,
        subjects
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      status: true,
      msg: "Profile Updated",
      user: updatedUser
    });

  } catch (err) {

    res.status(500).json({
      status: false,
      msg: "Profile update failed"
    });

  }
});

router.put("/change-password/:id", auth, async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.session.user);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.pass);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Current password incorrect" });
    }

    user.pass = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ status: true, message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

router.post("/google-login", async (req, res) => {

  try {

    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        msg: "Invalid Google login"
      });
    }

    let user = await User.findOne({ email });

    /* ================= CREATE USER IF NOT EXISTS ================= */

    if (!user) {

      user = await User.create({
        name,
        email,
        pass: "google-auth", // dummy password
        terms: true
      });

    }

    /* ================= CREATE SESSION ================= */

    req.session.user = user._id;

    req.session.save(() => {

      res.status(200).json({
        status: true,
        msg: "Google login successful",
        user
      });

    });

  } catch (error) {

    console.log("GOOGLE LOGIN ERROR:", error);

    res.status(500).json({
      status: false,
      msg: "Google login failed"
    });

  }

});

module.exports = router;
