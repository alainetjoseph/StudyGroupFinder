const User = require("../Modals/Users")

const auth = async (req, res, next) => {
  console.log("auth", req.session.user)
  try {
    if (!req.session.user) {
      return res.status(401).json({ status: false, msg: "Auth failed, try logging in" });
    }

    const user = await User.findById(req.session.user);

    if (!user) {
      return res.status(404).json({ msg: "User Not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({ status: false, error: "ACCOUNT_BLOCKED" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ status: false, msg: "Server Error" });
  }
};

module.exports = auth;