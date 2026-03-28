var express = require("express");
var router = express.Router();

var adminAuth = require("../middleware/adminAuth.js");

let User = require("../Modals/Users.js");
let Groups = require("../Modals/Groups.js");
let Reports = require("../Modals/Reports.js");
let Messages = require("../Modals/Message.js")

const { sendEmailAsync } = require("../services/emailService.js");


const adminController = require("../controllers/adminController.js");
const logController = require("../controllers/logController.js");
const { logActivity } = require("../utils/activityLogger.js");

/* ================= STATS ================= */

router.get("/stats", adminAuth, adminController.getStats);


/* ================= LOGS ================= */

router.get("/logs", adminAuth, logController.getLogs);
router.get("/logs/types", adminAuth, logController.getActionTypes);


/* ================= USERS ================= */

router.get("/users", adminAuth, async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json({ users });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});
 
 
 /* GET SINGLE USER */
 
 router.get("/users/:id", adminAuth, async (req, res) => {
 
   try {
 
     const user = await User.findById(req.params.id)
       .select("-pass")
       .populate("groupsJoined groupsCreated");
 
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
 
     res.json(user);
 
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 
 });


/* GET SINGLE GROUP */

router.get("/groups/:id", adminAuth, async (req, res) => {

  try {

    const group = await Groups.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);

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
      { returnDocument: 'after' }
    );

    if (user && user.email) {
      sendEmailAsync({
        to: user.email,
        subject: "Account Banned",
        text: "Your account was banned by admin due to violation of platform policies.",
        theme: "dark",
        meta: { userId: user._id, action: "ban" }
      });
    }

    // Log Activity
    logActivity({
      actionType: "USER_BANNED",
      actor: { id: req.user._id, name: req.user.name, type: "admin" },
      target: { id: user._id, name: user.name, type: "user" },
      status: "success",
      metadata: { userId: user._id },
      req
    });

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
      { returnDocument: 'after' }
    );

    if (user && user.email) {
      sendEmailAsync({
        to: user.email,
        subject: "Account Restored",
        text: "Your account has been restored. You can now access the platform again.",
        theme: "dark",
        meta: { userId: user._id, action: "unban" }
      });
    }

    // Log Activity
    logActivity({
      actionType: "USER_UNBANNED",
      actor: { id: req.user._id, name: req.user.name, type: "admin" },
      target: { id: user._id, name: user.name, type: "user" },
      status: "success",
      metadata: { userId: user._id },
      req
    });

    res.json({ message: "User unbanned" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* DELETE USER */

router.delete("/users/:id", adminAuth, async (req, res) => {

  try {

    const user = await User.findByIdAndDelete(req.params.id);

    // Log Activity
    if (user) {
      logActivity({
        actionType: "USER_DELETED",
        actor: { id: req.user._id, name: req.user.name, type: "admin" },
        target: { id: user._id, name: user.name, type: "user" },
        status: "success",
        metadata: { userId: user._id },
        req
      });
    }

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
        sendEmailAsync({
          to: creator.email,
          subject: "Group Deleted",
          text: `The group "${group.name}" was removed by an administrator.`,
          theme: "dark",
          meta: { groupId: group._id, action: "delete_group" }
        });
      }


    }

    // Log Activity
    if (group) {
      logActivity({
        actionType: "GROUP_DELETED",
        actor: { id: req.user._id, name: req.user.name, type: "admin" },
        target: { id: group._id, name: group.groupName || group.name, type: "group" },
        status: "success",
        metadata: { groupId: group._id },
        req
      });
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

      const text = group.isLocked
        ? `The group "${group.name}" was locked by an administrator due to policy violations.`
        : `Your group "${group.name}" is now accessible again.`;

      sendEmailAsync({
        to: group.createdBy.email,
        subject,
        text,
        theme: "dark",
        meta: { groupId: group._id, action: group.isLocked ? "lock_group" : "unlock_group" }
      });


    }

    // Log Activity
    logActivity({
      actionType: group.isLocked ? "GROUP_LOCKED" : "GROUP_UNLOCKED",
      actor: { id: req.user._id, name: req.user.name, type: "admin" },
      target: { id: group._id, name: group.groupName || group.name, type: "group" },
      status: "success",
      metadata: { groupId: group._id, isLocked: group.isLocked },
      req
    });

    res.json({ message: "Group status updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= REPORTS ================= */

// router.get("/reports", adminAuth, async (req, res) => {
//
//   try {
//
//     const reports = await Reports.find()
//       .populate("reporter", "name email")
//       .sort({ createdAt: -1 });
//
//     res.json(reports);
//
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
//
// });
//
//
// /* RESOLVE REPORT */
//
// router.patch("/reports/:id/resolve", adminAuth, async (req, res) => {
//
//   try {
//
//     // const report = await Reports.findByIdAndUpdate(
//     //   req.params.id,
//     //   { status: "resolved" },
//     //   { new: true }
//     // ).populate("reportedBy");
//     //
//     // if (report?.reportedBy?.email) {
//     //
//     //   await sendEmail(
//     //     report.reportedBy.email,
//     //     "Report Resolved",
//     //     `
//     //     <h3>Report Status Update</h3>
//     //     <p>A report regarding your activity has been reviewed and resolved by the admin team.</p>
//     //     `
//     //   );
//     //
//     // }
//     //
//     // res.json({ message: "Report resolved" });
//     const { status, actionTaken } = req.body;
//
//     const report = await Reports.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         actionTaken,
//         moderatedBy: req.session.user
//       },
//       { new: true }
//     );
//
//     res.json(report);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
//
// });
//
//
// /* REJECT REPORT */
//
// router.patch("/reports/:id/reject", adminAuth, async (req, res) => {
//
//   try {
//
//     const report = await Reports.findByIdAndUpdate(
//       req.params.id,
//       { status: "rejected" },
//       { new: true }
//     ).populate("reportedBy");
//
//     if (report?.reportedBy?.email) {
//
//       await sendEmail(
//         report.reportedBy.email,
//         "Report Rejected",
//         `
//         <h3>Report Review Result</h3>
//         <p>The report submitted against you has been reviewed and rejected.</p>
//         `
//       );
//
//     }
//
//     res.json({ message: "Report rejected" });
//
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
//
// });


router.get("/reports", adminAuth, async (req, res) => {
  try {

    const reports = await Reports.find()
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= RESOLVE REPORT ================= */

router.patch("/reports/:id/resolve", adminAuth, async (req, res) => {
  try {

    const report = await Reports.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { returnDocument: 'after' }
    ).populate("reporter", "name email");

    if (report?.reporter?.email) {
      sendEmailAsync({
        to: report.reporter.email,
        subject: "Report Resolved",
        text: "A report regarding your activity has been reviewed and resolved by the admin team.",
        theme: "dark",
        meta: { reportId: report._id, action: "resolve_report" }
      });
    }

    // Log Activity
    logActivity({
      actionType: "REPORT_RESOLVED",
      actor: { id: req.user._id, name: req.user.name, type: "admin" },
      target: { id: report._id, name: `Report #${report._id}`, type: "report" },
      status: "success",
      metadata: { reportId: report._id },
      req
    });

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= DISMISS REPORT ================= */

router.patch("/reports/:id/dismiss", adminAuth, async (req, res) => {
  try {

    const report = await Reports.findByIdAndUpdate(
      req.params.id,
      { status: "dismissed" },
      { returnDocument: 'after' }
    ).populate("reporter", "name email");

    if (report?.reporter?.email) {
      sendEmailAsync({
        to: report.reporter.email,
        subject: "Report Rejected",
        text: "The report submitted against you has been reviewed and rejected.",
        theme: "dark",
        meta: { reportId: report._id, action: "dismiss_report" }
      });
    }

    // Log Activity
    logActivity({
      actionType: "REPORT_DISMISSED",
      actor: { id: req.user._id, name: req.user.name, type: "admin" },
      target: { id: report._id, name: `Report #${report._id}`, type: "report" },
      status: "success",
      metadata: { reportId: report._id },
      req
    });

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reports/:reportId/context", adminAuth, async (req, res) => {
  try {

    const report = await Reports.findById(req.params.reportId);

    if (!report || report.targetType !== "message")
      return res.json({ messages: [] });

    const message = await Messages.findById(report.targetId);

    if (!message)
      return res.json({ messages: [] });
    console.log(message)
    const contextMessages = await Messages.find({
      group: message.group,
      createdAt: { $lte: message.createdAt }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("sender", "name");

    res.json({
      reportedMessage: message._id,
      messages: contextMessages.reverse()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
