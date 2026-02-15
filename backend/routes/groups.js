var express = require("express")
var router = express.Router()
var Group = require("../Modals/Groups");
const Users = require("../Modals/Users");
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

module.exports = router;
