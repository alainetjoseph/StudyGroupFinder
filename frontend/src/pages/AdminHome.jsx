import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  Ban,
  Trash2, Lock, Unlock,
  CheckCircle,
  XCircle, ExternalLink, Activity,
  Loader2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ConfirmModal from "../components/ConfirmModal";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("users");
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const menuItems = [
    { label: "Admin Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [banConfirmOpen, setBanConfirmOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);

  const [stat, setStat] = useState({ users: 0, groups: 0, reports: 0 })
  const [groups, setGroups] = useState([]);
  const [processing, setProcessing] = useState({ id: null, action: null });

  useEffect(() => {
    fetchUsers()
    fetchGroups();
    fetchReports();
  }, []);

  async function fetchUsers() {
    try {
      setUsersLoading(true)
      const res = await axios.get(`${BACKEND}/admin/users`, { withCredentials: true })
      setUsers(res.data.users)
    } catch (err) {
      console.log(err)
      enqueueSnackbar("Error occurred, try refreshing", { anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    }
    finally {
      setUsersLoading(false)
    }
  }

  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      const res = await axios.get(`${BACKEND}/admin/groups`, { withCredentials: true });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGroupsLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const res = await axios.get(`${BACKEND}/admin/reports`, { withCredentials: true });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setReportsLoading(false);
    }
  };

  const toggleBan = async () => {
    if (!userToBan) return;
    try {
      setProcessing({ id: userToBan._id, action: "ban" });
      await axios.patch(`${BACKEND}/admin/users/${userToBan._id}/${userToBan.isBanned ? "unban" : "ban"}`, {}, { withCredentials: true })
      enqueueSnackbar(`User successfully ${userToBan.isBanned ? "unbanned" : "banned"}`, { variant: "success", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
      fetchUsers();
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update user status", { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    } finally {
      setBanConfirmOpen(false);
      setUserToBan(null);
      setProcessing({ id: null, action: null });
    }
  };

  //SEARCH FILTER 
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  // SEARCH END

  // ADMIN STATS


  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND}/admin/stats`, { withCredentials: true })

      if (res.data.success && res.data.totals) {
        setStat({
          users: res.data.totals.users,
          groups: res.data.totals.groups,
          reports: res.data.totals.reports
        });
      } else {
        // Fallback for old structure or unexpected response
        setStat(res.data || { users: 0, groups: 0, reports: 0 });
      }
    }
    catch (err) {
      console.log("Error fetching stats:", err);
    }
  }

  return (
    <div className="space-y-8">

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted">
            Monitor and manage the platform
          </p>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value={stat.users}
            color="bg-primary/20 text-primary"
          />

          <StatCard
            icon={<ShieldCheck size={28} />}
            title="Active Groups"
            value={stat.groups}
            color="bg-success/20 text-success"
          />

          <StatCard
            icon={<AlertTriangle size={28} />}
            title="Pending Reports"
            value={stat.reports}
            color="bg-destructive/20 text-destructive"
          />

        </div>

        {/* ===== Tabs ===== */}
        <div className="bg-card border border-border rounded-xl p-2 flex mb-6 shadow-sm">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="User Management"
          />
          <TabButton
            active={activeTab === "groups"}
            onClick={() => setActiveTab("groups")}
            label="Group Moderation"
          />
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            label="Reports"
          />
        </div>

        {/* ===== USERS TABLE ===== */}
        {activeTab === "users" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xl">

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-muted" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search users..."
                className="w-full bg-input-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] text-foreground"
              />
            </div>

            {/* Table */}
            {usersLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-input-background rounded-lg" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-input-background/50 rounded-lg" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState message="No users found matching your search." icon={Users} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-muted border-b border-border">
                    <tr>
                      <th className="text-left py-3">User</th>
                      <th className="text-left py-3">Email</th>
                      <th className="text-left py-3">Groups</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Joined</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={index}

                        className="border-b border-border hover:bg-card/20 cursor-pointer transition-colors"
                      >
                        <td className="py-4 font-medium text-foreground">{user.name}</td>
                        <td className="py-4 text-muted">{user.email}</td>
                        <td className="py-4">{user.groupsJoined.length}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${user.isBanned
                              ? "bg-destructive/20 text-destructive"
                              : "bg-success/20 text-success"
                              }`}
                          >
                            {user.isBanned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 text-muted">{new Date(user.createdAt || user.joined).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                        <td className="py-4 flex gap-3">
                          {/* View User */}
                          <a
                            href={`/admin/users/${user._id}`}
                            onClick={(e) => { e.preventDefault(); navigate(`/admin/users/${user._id}`); }}
                            className="text-primary hover:text-primary-hover"
                            title="View User"
                          >
                            <ExternalLink size={18} />
                          </a>

                          {/* Ban / Unban */}
                          <button
                            onClick={() => { setUserToBan(user); setBanConfirmOpen(true); }}
                            disabled={processing.id === user._id}
                            className={`${user.isBanned
                              ? "text-success hover:text-success/80"
                              : "text-destructive hover:text-destructive/80"
                              } disabled:opacity-50`}
                            title={user.isBanned ? "Unban User" : "Ban User"}
                          >
                            {processing.id === user._id && processing.action === "ban" ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : user.isBanned ? (
                              <Unlock size={18} />
                            ) : (
                              <Ban size={18} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* User Action Modal */}
            <ConfirmModal
              open={banConfirmOpen}
              onConfirm={toggleBan}
              onClose={() => setBanConfirmOpen(false)}
              title={userToBan?.isBanned ? "Unban User" : "Ban User"}
              desc={`Are you sure you want to ${userToBan?.isBanned ? "unban" : "ban"} ${userToBan?.name}? ${userToBan?.isBanned ? "They will regain access to the platform." : "They will be immediately disconnected and blocked."}`}
              buttonName={userToBan?.isBanned ? "Unban" : "Ban"}
              variant={userToBan?.isBanned ? "info" : "danger"}
              loading={processing.id === userToBan?._id && processing.action === "ban"}
            />

          </div>
        )}
        {
          activeTab === "groups" && (
            <GroupTable
              groups={groups}
              groupsLoading={groupsLoading}
              fetchGroups={fetchGroups}
              search={search}
              setSearch={setSearch}
              processing={processing}
              setProcessing={setProcessing}
              BACKEND={BACKEND}
            />
          )
        }
        {
          activeTab === "reports" && (
            <ReportsTable
              reports={reports}
              reportsLoading={reportsLoading}
              fetchReports={fetchReports}
              search={search}
              setSearch={setSearch}
              processing={processing}
              setProcessing={setProcessing}
              BACKEND={BACKEND}
              setUserToBan={setUserToBan}
              setBanConfirmOpen={setBanConfirmOpen}
            />
          )
        }
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function GroupTable({
  groups,
  groupsLoading,
  fetchGroups,
  search,
  setSearch,
  processing,
  setProcessing,
  BACKEND
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  const deleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      setProcessing({ id: selectedGroup._id, action: "delete" });
      await axios.delete(`${BACKEND}/admin/groups/${selectedGroup._id}`, { withCredentials: true });
      enqueueSnackbar("Group deleted explicitly", { variant: "success", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
      fetchGroups();
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to delete group", { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedGroup(null);
      setProcessing({ id: null, action: null });
    }
  };

  const toggleLock = async () => {
    if (!selectedGroup) return;
    try {
      setProcessing({ id: selectedGroup._id, action: "lock" });
      await axios.patch(`${BACKEND}/admin/groups/${selectedGroup._id}/toggle-lock`, {}, { withCredentials: true });
      enqueueSnackbar(`Group ${selectedGroup.isLocked ? "unlocked" : "locked"} successfully`, { variant: "info", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
      fetchGroups();
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update lock status", { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    } finally {
      setLockConfirmOpen(false);
      setSelectedGroup(null);
      setProcessing({ id: null, action: null });
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.groupName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xl">

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-muted" size={18} />
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-input-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] text-foreground"
        />
      </div>

      {groupsLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-input-background rounded-lg" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-input-background/50 rounded-lg" />
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <EmptyState message="No groups found matching your search." icon={ShieldCheck} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted border-b border-border">
              <tr>
                <th className="text-left py-3">Group</th>
                <th className="text-left py-3">Creator</th>
                <th className="text-left py-3">Members</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Created</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGroups.map((group) => (
                <tr
                  key={group._id}
                  onClick={() => navigate(`/admin/groups/${group._id}`)}
                  className="border-b border-border hover:bg-card/20 cursor-pointer transition-colors"
                >
                  <td className="py-4 font-medium text-foreground">
                    {group.groupName}
                  </td>

                  <td className="py-4 text-muted">
                    {group.createdBy?.name || "Unknown"}
                  </td>

                  <td className="py-4">
                    {group.members?.length || 0}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${group.isLocked
                        ? "bg-destructive/20 text-destructive"
                        : "bg-success/20 text-success"
                        }`}
                    >
                      {group.isLocked ? "Locked" : "Active"}
                    </span>
                  </td>

                  <td className="py-4 text-muted">
                    {new Date(group.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </td>

                  <td className="py-4 flex gap-3">

                    {/* View Group */}
                    <a
                      href={`/admin/groups/${group._id}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/admin/groups/${group._id}`); }}
                      className="text-primary hover:text-primary-hover"
                      title="View Group"
                    >
                      <ExternalLink size={18} />
                    </a>

                    {/* Lock / Unlock */}
                    <button
                      onClick={() => { setSelectedGroup(group); setLockConfirmOpen(true); }}
                      disabled={processing.id === group._id}
                      className="text-warning hover:text-warning/80 disabled:opacity-50"
                      title={group.isLocked ? "Unlock Group" : "Lock Group"}
                    >
                      {processing.id === group._id && processing.action === "lock" ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : group.isLocked ? (
                        <Unlock size={18} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => { setSelectedGroup(group); setDeleteConfirmOpen(true); }}
                      disabled={processing.id === group._id}
                      className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                      title="Delete Group"
                    >
                      {processing.id === group._id && processing.action === "delete" ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={lockConfirmOpen}
        onConfirm={toggleLock}
        onClose={() => setLockConfirmOpen(false)}
        title={selectedGroup?.isLocked ? "Unlock Group" : "Lock Group"}
        desc={selectedGroup?.isLocked
          ? `Are you sure you want to unlock "${selectedGroup?.groupName}"? New members will be able to join.`
          : `Are you sure you want to lock "${selectedGroup?.groupName}"? No new members will be able to join, and current members will be restricted from some actions.`}
        buttonName={selectedGroup?.isLocked ? "Unlock" : "Lock"}
        variant="warning"
        loading={processing.id === selectedGroup?._id && processing.action === "lock"}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onConfirm={deleteGroup}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Group"
        desc="Are you sure you want to delete this group? This action cannot be undone and all data will be lost."
        buttonName="Delete"
        variant="danger"
        loading={processing.id === selectedGroup?._id && processing.action === "delete"}
      />
    </div>
  );
}

function ReportsTable({
  reports,
  reportsLoading,
  fetchReports,
  search,
  setSearch,
  processing,
  setProcessing,
  BACKEND,
  setUserToBan,
  setBanConfirmOpen
}) {
  const [filterTab, setFilterTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const resolveReport = async (id) => {
    try {
      await axios.patch(
        `${BACKEND}/admin/reports/${id}/resolve`,
        {},
        { withCredentials: true }
      );
      enqueueSnackbar("Report resolved", { variant: "success", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
      fetchReports();
    } catch (err) {
      enqueueSnackbar("Failed to resolve report", { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    }
  };

  const dismissReport = async (id) => {
    try {
      await axios.patch(
        `${BACKEND}/admin/reports/${id}/dismiss`,
        {},
        { withCredentials: true }
      );
      enqueueSnackbar("Report dismissed", { variant: "info", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
      fetchReports();
    } catch (err) {
      enqueueSnackbar("Failed to dismiss report", { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.reason.toLowerCase().includes(search.toLowerCase()) || r.targetType.toLowerCase().includes(search.toLowerCase());
    const matchesTab = filterTab === "all" || r.status === filterTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xl">

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-muted" size={18} />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-input-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] text-foreground"
        />
      </div>

      {/* REPORt FILTER TABS */}
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {["all", "pending", "resolved"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filterTab === tab ? "bg-primary text-foreground" : "text-muted hover:text-foreground hover:bg-background"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {reportsLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-input-background rounded-lg" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-input-background/50 rounded-lg" />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState message={`No ${filterTab === 'all' ? '' : filterTab} reports found.`} icon={AlertTriangle} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted border-b border-border">
              <tr>
                <th className="text-left py-3">Reporter</th>
                <th className="text-left py-3">Target</th>
                <th className="text-left py-3">Evidence</th>
                <th className="text-left py-3">Reason</th>
                <th className="text-left py-3">Description</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report._id}
                  onClick={() => setSelectedReport(report)}
                  className="border-b border-border hover:bg-card/20 cursor-pointer"
                >
                  {/* REPORTER */}
                  <td className="py-4">
                    <div className="font-medium text-foreground">
                      {report.reporter?.name || "Unknown"}
                    </div>
                    <div className="text-muted text-xs">
                      {report.reporter?.email}
                    </div>
                  </td>
                  {/* TARGET */}
                  <td className="py-4 capitalize text-primary">
                    {report.targetType}
                  </td>
                  {/* SNAPSHOT EVIDENCE */}
                  <td className="py-4 max-w-xs">
                    {report.targetType === "group" && (
                      <>
                        <div className="font-medium text-foreground">{report.snapshot?.title}</div>
                        <div className="text-muted text-xs">{report.snapshot?.text}</div>
                      </>
                    )}
                    {report.targetType === "user" && (
                      <>
                        <div className="font-medium text-foreground">{report.snapshot?.owner}</div>
                        <div className="text-muted text-xs">{report.snapshot?.text}</div>
                      </>
                    )}
                    {report.targetType === "message" && (
                      <>
                        <div className="font-medium text-destructive">Message by {report.snapshot?.owner}</div>
                        <div className="text-muted text-xs">{report.snapshot?.messageText}</div>
                      </>
                    )}
                  </td>
                  {/* REASON */}
                  <td className="py-4 capitalize text-foreground">{report.reason}</td>
                  {/* DESCRIPTION */}
                  <td className="py-4 text-muted">{report.description || "—"}</td>
                  {/* STATUS */}
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === "pending"
                        ? "bg-warning/20 text-warning"
                        : report.status === "resolved"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                        }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  {/* DATE */}
                  <td className="py-4 text-muted">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  {/* ACTIONS */}
                  <td className="py-4 flex gap-3">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); resolveReport(report._id); }}
                          className="text-success hover:text-success/80"
                          title="Resolve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismissReport(report._id); }}
                          className="text-destructive hover:text-destructive/80"
                          title="Dismiss"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ReportDetails
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        resolveReport={resolveReport}
        dismissReport={dismissReport}
        onBanUser={(userId) => {
          setUserToBan({ _id: userId, name: "Report Target", isBanned: false });
          setBanConfirmOpen(true);
        }}
      />
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ icon, title, value, growth, color }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:scale-105 transition shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-success text-sm font-medium">
          {growth}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-foreground">{value}</h2>
      <p className="text-muted text-sm">{title}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${active
        ? "bg-primary text-foreground shadow-lg shadow-primary/20"
        : "text-muted hover:text-foreground hover:bg-card"
        }`}
    >
      {label}
    </button>
  );
}

function ReportDetails({ report, onClose, resolveReport, dismissReport, onBanUser }) {

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [contextMessages, setContextMessages] = useState([]);

  useEffect(() => {
    if (!report || report.targetType !== "message") return;

    axios
      .get(`${BACKEND}/admin/reports/${report._id}/context`, {
        withCredentials: true
      })
      .then((res) => {
        setContextMessages(res.data.messages);
      })
      .catch(() => { });

  }, [report]);

  if (!report) return null;

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 1));

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const startDrag = (e) => {
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const duringDrag = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y
    });
  };

  const stopDrag = () => setDragging(false);

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto p-6">

      <div className="bg-card border border-border w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Report Details</h2>

          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg"
          >
            ✕
          </button>
        </div>

        {/* REPORTER */}
        <div className="mb-4">
          <p className="text-muted text-sm">Reporter</p>
          <p className="font-medium">
            {report.reporter?.name} ({report.reporter?.email})
          </p>
        </div>

        {/* TARGET */}
        <div className="mb-4">
          <p className="text-muted text-sm">Target Type</p>
          <p className="capitalize text-primary">
            {report.targetType}
          </p>
        </div>

        {/* SNAPSHOT */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm mb-2">
            Evidence Snapshot
          </p>

          <div className="bg-input-background p-4 rounded-lg border border-border">

            {report.targetType === "group" && (
              <>
                <p className="font-semibold">{report.snapshot?.title}</p>
                <p className="text-muted text-sm mt-1">
                  {report.snapshot?.text}
                </p>
              </>
            )}

            {report.targetType === "user" && (
              <>
                <p className="font-semibold">{report.snapshot?.owner}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {report.snapshot?.text}
                </p>
              </>
            )}

            {report.targetType === "message" && (
              <>
                <p className="text-destructive font-semibold">
                  Message by {report.snapshot?.owner}
                </p>

                <p className="text-text-secondary text-sm mt-2">
                  {report.snapshot?.messageText}
                </p>
              </>
            )}

            {report.targetType === "message" && contextMessages.length > 0 && (

              <div className="mt-6">

                <p className="text-muted text-sm mb-2">
                  Message Context
                </p>

                <div className="bg-input-background p-4 rounded-lg space-y-2 max-h-64 overflow-y-auto border border-border">

                  {contextMessages.map((msg) => {

                    const isReported = msg._id === report.targetId;

                    return (

                      <div
                        key={msg._id}
                        className={`p-2 rounded ${isReported
                          ? "bg-destructive/20 border border-danger-base"
                          : "bg-card"
                          }`}
                      >

                        <p className="text-xs text-primary">
                          {msg.sender?.name}
                        </p>

                        <p className="text-sm text-foreground">
                          {msg.text}
                        </p>

                        {isReported && (
                          <span className="text-destructive text-xs">
                            Reported Message
                          </span>
                        )}

                      </div>

                    );

                  })}

                </div>

              </div>

            )}

          </div>
        </div>

        {/* REASON */}
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">Reason</p>
          <p className="capitalize">{report.reason}</p>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">Reporter Description</p>
          <p>{report.description || "No description provided"}</p>
        </div>

        {/* STATUS */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">Status</p>

          <span
            className={`px-3 py-1 rounded-full text-xs ${report.status === "pending"
              ? "bg-warning/20 text-warning"
              : report.status === "resolved"
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
              }`}
          >
            {report.status}
          </span>
        </div>

        {/* USER EVIDENCE IMAGES */}
        {report.evidenceImages?.length > 0 && (

          <div className="mt-6">

            <p className="text-muted-foreground text-sm mb-3">
              User Evidence
            </p>

            <div className="flex gap-3 flex-wrap">

              {report.evidenceImages.map((img, i) => (

                <img
                  key={i}
                  src={`${BACKEND}/uploads/reportEvidence/${img}`}
                  alt="evidence"
                  onClick={() => {
                    setSelectedImage(
                      `${BACKEND}/uploads/reportEvidence/${img}`
                    );
                    resetZoom();
                  }}
                  className="w-24 h-24 object-cover rounded-lg border border-border cursor-pointer hover:scale-105 transition"
                />

              ))}

            </div>

          </div>

        )}

        {/* MODERATION ACTIONS & DIRECT PENALTIES (4A, 6A) */}
        {report.status === "pending" && (
          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-border">

            <div className="flex gap-4 justify-between items-center">
              <div>
                {(report.targetType === "user" || report.targetType === "message") && (
                  <button
                    onClick={() => onBanUser(report.targetId)}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive border border-danger-base/50 rounded-lg hover:bg-destructive hover:text-foreground transition"
                  >
                    <Ban size={16} /> Fast-Ban Reported User
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => resolveReport(report._id)}
                  className="px-6 py-2 bg-success text-foreground rounded-lg hover:bg-success/80"
                >
                  Resolve
                </button>

                <button
                  onClick={() => dismissReport(report._id)}
                  className="px-6 py-2 bg-card text-foreground rounded-lg hover:bg-card/80"
                >
                  Dismiss
                </button>
              </div>
            </div>

          </div>
        )}

      </div>


      {/* IMAGE VIEWER */}
      {selectedImage && (

        <div
          className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[60]"
          onWheel={handleWheel}
          onMouseMove={duringDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >

          {/* CLOSE */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-8 text-foreground text-3xl"
          >
            ✕
          </button>

          {/* ZOOM CONTROLS */}
          <div className="absolute top-6 left-8 flex gap-3">

            <button
              onClick={zoomOut}
              className="bg-card px-3 py-1 rounded text-foreground"
            >
              −
            </button>

            <button
              onClick={zoomIn}
              className="bg-card px-3 py-1 rounded text-foreground"
            >
              +
            </button>

            <button
              onClick={resetZoom}
              className="bg-card px-3 py-1 rounded text-foreground"
            >
              Reset
            </button>

          </div>

          {/* IMAGE */}
          <img
            src={selectedImage}
            alt="preview"
            onMouseDown={startDrag}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              cursor: dragging ? "grabbing" : "grab",
              transition: dragging ? "none" : "transform 0.15s"
            }}
            className="max-h-[90vh] max-w-[90vw] select-none"
          />

        </div>

      )}

    </div>
  );
}

function EmptyState({ message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="bg-slate-800/30 p-5 rounded-full mb-4 ring-1 ring-slate-700">
        <Icon size={36} className="text-slate-500" />
      </div>
      <p className="text-lg font-medium tracking-wide">{message}</p>
    </div>
  );
}
