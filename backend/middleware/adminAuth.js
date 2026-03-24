var Users = require("../Modals/Users")

module.exports = async function(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Login again" });
    }
    const user = await Users.findById(req.session.user);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
