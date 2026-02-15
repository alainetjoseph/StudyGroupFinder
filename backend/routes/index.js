var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var User = require('../Modals/Users')
var userHelper = require("../helper/userHelpers.js")
/* GET home page. */

const auth = (req, res, next) => {
  console.log("auth", req.session.user)
  if (!req.session.user) {
    return res.status(400).json({ status: false, msg: "auth Failed, Try Logging in !!" })
  }
  next()
}

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

module.exports = router;
