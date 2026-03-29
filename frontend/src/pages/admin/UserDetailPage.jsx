import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  Users,
  PlusCircle,
  Ban,
  Unlock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { enqueueSnackbar } from "notistack";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND}/admin/users/${id}`, { withCredentials: true });
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user details. The user might not exist or you don't have permission.");
      enqueueSnackbar("Error loading user details", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-card rounded-full" />
          <div className="h-8 w-48 bg-card rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 h-64 bg-card rounded-xl border border-border" />
          <div className="md:col-span-2 h-64 bg-card rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary-hover transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-card rounded-full transition text-muted hover:text-foreground"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Details</h1>
            <p className="text-muted">Administrator view of user profile and activity</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${user.isBanned ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-success/20 text-success border border-success/30"
            }`}>
            {user.isBanned ? <Ban size={14} /> : <Unlock size={14} />}
            {user.isBanned ? "Banned" : "Active"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {user.isAdmin && (
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-primary/30">
                  Admin
                </span>
              )}
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-primary-glow">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted text-sm flex items-center justify-center gap-1 mt-1">
                <Mail size={14} /> {user.email}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <InfoItem icon={<Shield size={18} />} label="Role" value={user.isAdmin ? "Administrator" : "User"} />
              <InfoItem icon={<Calendar size={18} />} label="Joined" value={new Date(user.createdAt || user.joined).toLocaleDateString(undefined, { dateStyle: 'long' })} />
              <InfoItem icon={<BookOpen size={18} />} label="Subjects" value={user.subjects?.length > 0 ? user.subjects.join(", ") : "None specified"} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Biography
            </h3>
            <p className="text-muted text-sm leading-relaxed italic">
              {user.bio || "No biography provided by user."}
            </p>
          </div>
        </div>

        {/* Right Column: Activity / Lists */}
        <div className="lg:col-span-2 space-y-8">
          {/* Groups Joined */}
          <section className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card/50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Joined Groups ({user.groupsJoined?.length || 0})
              </h3>
            </div>
            <div className="p-0">
              {user.groupsJoined?.length > 0 ? (
                <div className="divide-y divide-border">
                  {user.groupsJoined.map((group) => (
                    <div
                      key={group._id}
                      onClick={() => navigate(`/admin/groups/${group._id}`)}
                      className="p-4 hover:bg-background/50 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{group.groupName}</p>
                        <p className="text-xs text-muted">{group.subject}</p>
                      </div>
                      <ArrowLeft size={16} className="rotate-180 text-muted" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted text-sm">
                  User hasn't joined any groups yet.
                </div>
              )}
            </div>
          </section>

          {/* Groups Created */}
          <section className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card/50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <PlusCircle size={18} className="text-accent" />
                Owned Groups ({user.groupsCreated?.length || 0})
              </h3>
            </div>
            <div className="p-0">
              {user.groupsCreated?.length > 0 ? (
                <div className="divide-y divide-border">
                  {user.groupsCreated.map((group) => (
                    <div
                      key={group._id}
                      onClick={() => navigate(`/admin/groups/${group._id}`)}
                      className="p-4 hover:bg-background/50 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{group.groupName}</p>
                        <p className="text-xs text-muted">Created: {new Date(group.createdAt).toLocaleDateString()}</p>
                      </div>
                      <ArrowLeft size={16} className="rotate-180 text-muted" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted text-sm">
                  User hasn't created any groups.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
