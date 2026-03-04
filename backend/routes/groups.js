var express = require("express")
var router = express.Router()
var Group = require("../Modals/Groups");
const Users = require("../Modals/Users");
var auth = require("../middleware/auth");
const Groups = require("../Modals/Groups");
var mongoose = require("mongoose");
const Message = require("../Modals/Message");
const fs = require("fs");
const path = require("path");

const upload = require("../middleware/upload.js");
const scanFile = require("../utils/clamScanner.js");
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

router.get("/:groupId/messages", async (req, res) => {
  try {
    const messages = await Message.find({
      group: req.params.groupId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    console.log("groupId")

    let group = await Groups.findById(groupId).populate("members", "name")
    res.status(200).json({ group })
  }
  catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

router.post("/leave", auth, async (req, res) => {
  try {
    const { groupId } = req.body
    let userId = req.session.user
    let leaveGroup = await Groups.updateOne({
      _id: groupId
    },
      {
        $pull: { members: userId }
      })
    await Users.updateOne(
      { _id: userId },
      { $pull: { groupsJoined: groupId } }
    )
    console.log("leaving from group", leaveGroup);
    res.status(200).json({ status: true, msg: "You Have successfully left the group" })

  }
  catch (error) {
    res.status(400).json({ status: false, msg: error })
  }
})


router.post(
  "/:groupId/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;

      // Scan file
      const scanResult = await scanFile(filePath);

      if (scanResult.infected) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          message: "File contains malware and was rejected",
          viruses: scanResult.viruses,
        });
      }

      // Ensure destination folder exists
      const uploadDir = path.join(__dirname, "..", "uploads", "groupFiles");
      fs.mkdirSync(uploadDir, { recursive: true });

      // Move file
      const finalPath = path.join(uploadDir, req.file.filename);
      fs.renameSync(filePath, finalPath);

      res.status(200).json({
        message: "File uploaded successfully",
        filename: req.file.filename,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);
module.exports = router;
