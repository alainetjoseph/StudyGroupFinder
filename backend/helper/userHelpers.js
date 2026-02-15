const { reject } = require("promise")
var Groups = require("../Modals/Groups")
var User = require("../Modals/Users")
const mongoose = require("mongoose")

module.exports = {
  getTopCards: function(userId) {
    return new Promise(async (resolve, reject) => {
      if (!userId) {
        reject({ err: "Invalid User Id" })
      }
      try {

        let id = new mongoose.Types.ObjectId(userId)
        let user = await User.findById(id)
        Promise.all([
          Groups.countDocuments({ _id: { $in: user.groupsJoined } }),
          Groups.countDocuments({ _id: { $in: user.groupsCreated }, status: "approved" }),
          Groups.countDocuments({ _id: { $in: user.groupsCreated }, status: "pending" })
        ]).then(([joinedCount, approvedCount, pendingCount]) => {
          console.log(joinedCount, approvedCount, pendingCount);
          resolve([
            { title: "Joined Groups", count: joinedCount, color: "text-indigo-500", type: "joined" },
            { title: "Groups Created", count: approvedCount, color: "text-green-500", type: "created" },
            { title: "Pending Requests", count: pendingCount, color: "text-yellow-500", type: "pending" }]);
        }).catch(() => {
          reject()
        })
      }
      catch (error) {
        reject();
      }
    })
  },
  getJoinedGroups: function(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(new mongoose.Types.ObjectId(userId))

        if (!user.groupsJoined.length) return resolve([]);
        Groups.findById({ _id: { $in: user.groupsJoined } }).select("+groupName").then((groups) => {
          resolve(groups)
        }).catch((error) => {
          console.log(error)
          reject()
        })
      }
      catch {
        reject()
      }
    })
  }
}
