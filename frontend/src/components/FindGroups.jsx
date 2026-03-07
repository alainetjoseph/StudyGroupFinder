import { useContext, useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
// Sidebar is now handled by Layout
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "../contexts/AuthContext"

export default function FindGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  function handleGroupJoin(groupId) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/groups/join-group`, { groupId, userId: user._id }, {
      withCredentials: true
    }).then(() => {
      enqueueSnackbar("joined group", { variant: 'success', anchorOrigin: { horizontal: "right", vertical: "bottom" } })
      navigate(`/group/${groupId}`)
    })
      .catch((error) => {
        const errorMsg = error.response?.data?.msg || "cannot join group";
        const displayMsg = errorMsg === "ALREADY_MEMBER" ? "You are already a member of this group" : errorMsg;
        enqueueSnackbar(displayMsg, { variant: "error", anchorOrigin: { horizontal: "right", vertical: 'bottom' } })
      })
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/groups`)
      .then(res => res.json())
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("FETCH GROUPS ERROR:", err);
        setLoading(false);
      });
  }, []);

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ===== Hero Banner ===== */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-foreground shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">
          Find Study Groups 🔎
        </h1>
        <p className="text-muted text-sm md:text-base">
          Discover communities that match your learning goals.
        </p>
      </div>

      {/* ===== Search Card ===== */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center bg-input-background border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring/50 transition">
          <Search size={18} className="text-muted mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search by group name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder-[var(--color-text-muted)] text-foreground"
          />
        </div>
        <div className="mt-4 text-xs text-muted font-medium">
          {filteredGroups.length} groups found
        </div>
      </div>

      {/* ===== Group Grid ===== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse p-6"></div>
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 text-muted text-lg">
          No groups found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition flex flex-col h-full shadow-lg hover:shadow-primary/10"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 gap-2">
                <h2 className="text-lg font-bold flex items-center gap-2 break-words leading-tight">
                  {group.groupName}
                  {group.isLocked && <span title="Group Locked by Admin" className="text-destructive text-sm shrink-0">🔒</span>}
                </h2>
                <span className="text-[10px] sm:text-xs bg-primary/20 text-primary px-3 py-1 rounded-full whitespace-nowrap font-semibold">
                  {group.subject}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted mb-6 line-clamp-3 leading-relaxed">
                {group.description}
              </p>

              {/* Members */}
              <div className="flex items-center gap-2 text-sm text-muted mb-8 mt-auto font-medium">
                <Users size={16} />
                {group.members.length} members
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition font-medium text-sm ${
                    group.isLocked 
                      ? "bg-card text-muted cursor-not-allowed" 
                      : group.members.includes(user?._id)
                        ? "bg-card text-muted cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover text-foreground shadow-lg shadow-primary/20 active:scale-95"
                  }`}
                  onClick={() => !group.isLocked && !group.members.includes(user?._id) && handleGroupJoin(group._id)}
                  disabled={group.isLocked || group.members.includes(user?._id)}
                >
                  {group.isLocked ? "Locked" : group.members.includes(user?._id) ? "Already Joined" : "Join Group"}
                </button>

                <button 
                  className="px-6 py-2.5 bg-border-muted hover:hover:bg-border border border-border rounded-xl transition text-sm font-medium active:scale-95 text-foreground" 
                  onClick={() => navigate(`/group/${group._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
