
const auth = (req, res, next) => {
  console.log("auth", req.session.user)
  if (!req.session.user) {
    return res.status(400).json({ status: false, msg: "auth Failed, Try Logging in !!" })
  }
  next()
}

module.exports = auth;
