var express = require("express")
var router = express.Router()
var Group = require("../Modals/Groups");
const Users = require("../Modals/Users");
var auth = require("../middleware/auth");
const Groups = require("../Modals/Groups");
var mongoose = require("mongoose")
/* ================= CREATE GROUP ================= */
router.post("/create", async (req, res) => {
  try {

    const { groupName, subject, description, createdBy } = req.body;

    if (!groupName || !subject || !description || !createdBy) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await Users.findById(createdBy)
    const newGroup = await Group.create({
      groupName,
      subject,
      description,
      createdBy,
      members: [createdBy] // Creator auto joins
    });

    user.groupsCreated.push(newGroup._id);
    user.save().then(() => {
      res.status(201).json({
        message: "Group created successfully",
        group: newGroup
      });
    })

  } catch (error) {
    console.log("CREATE GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {

    const groups = await Group.find();

    res.status(200).json(groups);

  } catch (error) {
    console.log("GET GROUPS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/join-group", auth, async (req, res) => {
  const { groupId } = req.body;
  const userId = req.session.user;
  console.log(userId)

  try {
    //  Add user to group
    // const groupUpdate = await Groups.updateOne(
    //   { _id: groupId },
    //   { $addToSet: { members: userId } },
    //   { session }
    // );
    //
    const groupUpdate = await Groups.updateOne({ _id: groupId },
      { $addToSet: { members: userId } }
    );
    if (groupUpdate.matchedCount === 0) {
      throw new Error("Group not found");
    }

    //  Add group to user
    // await Users.updateOne(
    //   { _id: userId },
    //   { $addToSet: { groupsJoined: groupId } },
    //   { session }
    // );
    var userUp = await Users.updateOne({ _id: userId },
      { $addToSet: { groupsJoined: groupId } })
    // await session.commitTransaction();
    // session.endSession();
    //
    console.log("user", userUp)

    return res.status(200).json({
      status: true,
      msg: "Joined successfully"
    });

  } catch (error) {
    return res.status(400).json({
      status: false,
      msg: error.message
    });
  }
});

module.exports = router;
