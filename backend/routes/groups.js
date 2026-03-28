var express = require("express")
var router = express.Router()
var Group = require("../Modals/Groups");
const Users = require("../Modals/Users");
var auth = require("../middleware/auth");
const Groups = require("../Modals/Groups");
var mongoose = require("mongoose");
const Message = require("../Modals/Message");
const Materials = require("../Modals/Materials");
const { getIO } = require("../socket");

const fs = require("fs");
const path = require("path");

const upload = require("../middleware/upload.js");
const scanFile = require("../utils/clamScanner.js");
const { apiLimiter } = require("../middleware/rateLimiter.js");
const { logActivity } = require("../utils/activityLogger.js");

/* ================= CREATE GROUP ================= */
router.post("/create", auth, apiLimiter, async (req, res) => {
  try {

    const { groupName, subject, description } = req.body;
    const createdBy = req.session.user;

    if (!groupName || !subject || !description) {
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
    user.groupsJoined.push(newGroup._id);
    await user.save();

    // Log Activity
    logActivity({
      actionType: "GROUP_CREATED",
      actor: { id: req.user._id, name: req.user.name, type: "user" },
      target: { id: newGroup._id, name: newGroup.groupName, type: "group" },
      status: "success",
      metadata: { subject: newGroup.subject },
      req
    });

    res.status(201).json({
      message: "Group created successfully",
      group: newGroup
    });

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
    const groupCheck = await Groups.findById(groupId);
    if (!groupCheck) {
      throw new Error("Group not found");
    }
    if (groupCheck.isLocked) {
      throw new Error("GROUP_LOCKED");
    }

    if (groupCheck.members.includes(userId)) {
      throw new Error("ALREADY_MEMBER");
    }

    const groupUpdate = await Groups.updateOne({ _id: groupId },
      { $addToSet: { members: userId } }
    );

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
    // Log Activity
    logActivity({
      actionType: "USER_JOINED_GROUP",
      actor: { id: userId, name: req.user.name, type: "user" },
      target: { id: groupId, name: groupCheck.groupName, type: "group" },
      status: "success",
      metadata: { groupId },
      req
    });

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

router.get("/:groupId/messages", auth, async (req, res) => {
  try {
    const groupCheck = await Groups.findById(req.params.groupId);
    if (groupCheck && groupCheck.isLocked) {
      return res.status(403).json({ error: "GROUP_LOCKED", message: "Group is locked. Cannot read messages." });
    }

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

    // Log Activity
    logActivity({
      actionType: "USER_LEFT_GROUP",
      actor: { id: userId, name: req.user.name, type: "user" },
      target: { id: groupId, type: "group" },
      status: "success",
      metadata: { groupId },
      req
    });

    res.status(200).json({ status: true, msg: "You Have successfully left the group" })

  }
  catch (error) {
    res.status(400).json({ status: false, msg: error })
  }
})



router.post("/:groupId/upload", auth, apiLimiter, upload.single("file"), async (req, res) => {
  try {
    const groupCheck = await Groups.findById(req.params.groupId);
    if (groupCheck && groupCheck.isLocked) {
      if (req.file) await fs.promises.unlink(req.file.path).catch(() => null);
      return res.status(403).json({ error: "GROUP_LOCKED", message: "Cannot upload to locked group." });
    }

    const tempPath = req.file.path;

    const result = await scanFile(tempPath);

    if (result.infected) {
      await fs.promises.unlink(tempPath);

      return res.status(400).json({
        message: "Virus detected",
        viruses: result.viruses
      });
    }

    // move file to final folder
    const finalFolder = path.join(__dirname, "..", "uploads/groupFiles");

    if (!fs.existsSync(finalFolder)) {
      fs.mkdirSync(finalFolder, { recursive: true });
    }

    const finalPath = path.join(finalFolder, req.file.filename);

    await fs.promises.rename(tempPath, finalPath);

    const material = await Materials.create({
      groupId: req.params.groupId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedBy: req.session.user,
      path: `/uploads/groupFiles/${req.file.filename}`,
      messageId:
        req.body.messageId && req.body.messageId !== "null"
          ? req.body.messageId
          : null
    });

    await material.populate("uploadedBy", "name");

    // Log Activity
    logActivity({
      actionType: "MATERIAL_UPLOADED",
      actor: { id: req.user._id, name: req.user.name, type: "user" },
      target: { id: material._id, name: material.originalName, type: "material" },
      status: "success",
      metadata: { groupId: req.params.groupId, filename: material.filename },
      req
    });

    const io = getIO();
    io.to(req.params.groupId).emit("materialUploaded", material);

    res.json(material);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/:groupId/materials", async (req, res) => {

  try {

    const materials = await Materials
      .find({ groupId: req.params.groupId })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.json(materials);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch materials"
    });

  }

});

router.get("/materials/:id/download", async (req, res) => {

  const material = await Materials.findById(req.params.id);

  if (!material) {
    return res.status(404).json({
      message: "File not found"
    });
  }

  const filePath = path.join(
    __dirname,
    "..",
    material.path
  );

  res.download(filePath, material.originalName);
});

/*EDIT MESSAGE*/

router.put("/message/edit/:id", auth, async (req, res) => {
  try {

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const groupCheck = await Groups.findById(message.group);
    if (groupCheck && groupCheck.isLocked) {
      return res.status(403).json({ error: "GROUP_LOCKED", message: "Message editing disabled for locked groups." });
    }

    if (message.sender.toString() !== String(req.session.user)) {
      return res.status(403).json({ msg: "You can only edit your message" });
    }

    message.text = req.body.text;
    message.edited = true;

    await message.save();

    const io = getIO();
    io.to(message.group.toString()).emit("messageUpdated", {
      messageId: message._id,
      text: message.text,
      edited: true
    });

    res.json({ status: true, message });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/*DELETE MESSAGE*/

router.delete("/message/delete/:id", auth, async (req, res) => {
  try {

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const groupCheck = await Groups.findById(message.group);
    if (groupCheck && groupCheck.isLocked) {
      return res.status(403).json({ error: "GROUP_LOCKED", message: "Message deletion disabled for locked groups." });
    }

    if (message.sender.toString() !== String(req.session.user)) {
      return res.status(403).json({ msg: "You can only delete your message" });
    }

    const groupId = message.group.toString();
    await Message.findByIdAndDelete(req.params.id);

    const io = getIO();
    io.to(groupId).emit("messageDeleted", {
      messageId: req.params.id
    });

    res.json({
      status: true,
      msg: "Message deleted"
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
