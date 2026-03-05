var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var User = require('../Modals/Users')
var userHelper = require("../helper/userHelpers.js")
var auth = require('../middleware/auth.js')
/* GET home page. */


router.post('/signup', async function(req, res, next) {
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

router.post("/login", async (req, res) => {
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

router.post("/reports", auth, async (req, res) => {
  const report = await Report.create({
    reportedBy: req.user.id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
    reason: req.body.reason
  });
  res.json(report);
});

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

module.exports = router;
