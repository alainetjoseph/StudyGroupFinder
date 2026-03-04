var express = require("express");
var router = express.Router();

var adminAuth = require("../middleware/adminAuth");

let User = require("../Modals/Users");
let Groups = require("../Modals/Groups");
let Reports = require("../Modals/Reports");

let sendEmail = require("../utils/sendEmail");


/* ================= STATS ================= */

router.get("/stats", adminAuth, async (req, res) => {
  try {

    const users = await User.countDocuments();
    const groups = await Groups.countDocuments();
    const reports = await Reports.countDocuments({ status: "pending" });

    res.json({ users, groups, reports });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= USERS ================= */

router.get("/users", adminAuth, async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json({ users });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* BAN USER */

router.patch("/users/:id/ban", adminAuth, async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    if (user && user.email) {

      await sendEmail(
        user.email,
        "Account Banned",
        `
        <h2>Your account has been banned</h2>
        <p>Your account was banned by admin due to violation of platform policies.</p>
        `
      );

    }

    res.json({ message: "User banned" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* UNBAN USER */

router.patch("/users/:id/unban", adminAuth, async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    );

    if (user && user.email) {

      await sendEmail(
        user.email,
        "Account Restored",
        `
        <h2>Your account has been restored</h2>
        <p>You can now access the platform again.</p>
        `
      );

    }

    res.json({ message: "User unbanned" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* DELETE USER */

router.delete("/users/:id", adminAuth, async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= GROUPS ================= */

router.get("/groups", adminAuth, async (req, res) => {

  try {

    const groups = await Groups.find().populate("createdBy members");

    res.json(groups);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* DELETE GROUP */

router.delete("/groups/:id", adminAuth, async (req, res) => {

  try {

    const group = await Groups.findByIdAndDelete(req.params.id);

    if (group && group.createdBy) {

      const creator = await User.findById(group.createdBy);

      if (creator?.email) {

        await sendEmail(
          creator.email,
          "Group Deleted",
          `
          <h2>Your group has been deleted</h2>
          <p>The group <b>${group.name}</b> was removed by admin.</p>
          `
        );

      }

    }

    res.json({ message: "Group deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* LOCK / UNLOCK GROUP */

router.patch("/groups/:id/toggle-lock", adminAuth, async (req, res) => {

  try {

    const group = await Groups.findById(req.params.id)
      .populate("createdBy");

    group.isLocked = !group.isLocked;

    await group.save();

    if (group.createdBy?.email) {

      const subject = group.isLocked
        ? "Group Locked"
        : "Group Unlocked";

      const message = group.isLocked
        ? `
        <h2>Your group has been locked</h2>
        <p>Group: <b>${group.name}</b></p>
        <p>The group was locked by admin due to policy violations.</p>
        `
        : `
        <h2>Your group has been unlocked</h2>
        <p>Group: <b>${group.name}</b></p>
        <p>Your group is now accessible again.</p>
        `;

      await sendEmail(group.createdBy.email, subject, message);

    }

    res.json({ message: "Group status updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= REPORTS ================= */

router.get("/reports", adminAuth, async (req, res) => {

  try {

    const reports = await Reports.find()
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* RESOLVE REPORT */

router.patch("/reports/:id/resolve", adminAuth, async (req, res) => {

  try {

    const report = await Reports.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    ).populate("reportedBy");

    if (report?.reportedBy?.email) {

      await sendEmail(
        report.reportedBy.email,
        "Report Resolved",
        `
        <h3>Report Status Update</h3>
        <p>A report regarding your activity has been reviewed and resolved by the admin team.</p>
        `
      );

    }

    res.json({ message: "Report resolved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* REJECT REPORT */

router.patch("/reports/:id/reject", adminAuth, async (req, res) => {

  try {

    const report = await Reports.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("reportedBy");

    if (report?.reportedBy?.email) {

      await sendEmail(
        report.reportedBy.email,
        "Report Rejected",
        `
        <h3>Report Review Result</h3>
        <p>The report submitted against you has been reviewed and rejected.</p>
        `
      );

    }

    res.json({ message: "Report rejected" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


module.exports = router;
