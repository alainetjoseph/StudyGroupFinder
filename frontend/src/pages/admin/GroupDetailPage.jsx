import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  BookOpen, 
  Shield, 
  Info,
  User,
  Mail,
  Lock,
  Unlock,
  Loader2,
  AlertCircle,
  Clock
} from "lucide-react";
import { enqueueSnackbar } from "notistack";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND}/admin/groups/${id}`, { withCredentials: true });
      setGroup(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch group details. The group might have been deleted.");
      enqueueSnackbar("Error loading group details", { variant: "error" });
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
        <div className="h-96 bg-card rounded-2xl border border-border" />
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

  if (!group) return null;

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
            <h1 className="text-3xl font-bold text-foreground">Group Details</h1>
            <p className="text-muted">Moderation view of study group details and membership</p>
          </div>
        </div>
        <div className="flex gap-3">
           <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
             group.isLocked ? "bg-warning/20 text-warning border border-warning/30" : "bg-success/20 text-success border border-success/30"
           }`}>
             {group.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
             {group.isLocked ? "Locked" : "Active"}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Info & description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  {group.subject}
                </span>
                <h2 className="text-4xl font-black text-foreground">{group.groupName}</h2>
              </div>
              <div className="text-right">
                 <p className="text-xs text-muted uppercase tracking-tighter font-bold mb-1">Created On</p>
                 <p className="text-sm font-medium flex items-center gap-1">
                   <Clock size={14} className="text-primary" />
                   {new Date(group.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                 </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Info size={18} className="text-primary" />
                Description
              </h3>
              <p className="text-muted leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card/50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Members ({group.members?.length || 0})
              </h3>
            </div>
            <div className="p-0">
               {group.members?.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="text-xs text-muted uppercase bg-background/30">
                       <tr>
                         <th className="px-6 py-3">Member</th>
                         <th className="px-6 py-3">Email</th>
                         <th className="px-6 py-3">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {group.members.map((member) => (
                         <tr 
                           key={member._id} 
                           className="hover:bg-background/40 transition-colors"
                         >
                           <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                               {member.name.charAt(0)}
                             </div>
                             {member.name}
                           </td>
                           <td className="px-6 py-4 text-muted">{member.email}</td>
                           <td className="px-6 py-4">
                             <button 
                               onClick={() => navigate(`/admin/users/${member._id}`)}
                               className="text-primary hover:underline hover:text-primary-hover font-medium"
                             >
                               View Details
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="p-12 text-center text-muted">
                   This group has no members yet.
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar: Meta Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Creator
            </h3>
            
            {group.createdBy ? (
              <div 
                onClick={() => navigate(`/admin/users/${group.createdBy._id}`)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-background/50 cursor-pointer border border-transparent hover:border-border transition group"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-foreground group-hover:text-primary transition">{group.createdBy.name}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Mail size={12} /> {group.createdBy.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted italic text-sm">Creator information unavailable.</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-success" />
              Quick Stats
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-border/50">
                 <span className="text-muted text-sm">Status</span>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                    group.status === "approved" ? "text-success bg-success/10" : "text-warning bg-warning/10"
                 }`}>{group.status}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border/50">
                 <span className="text-muted text-sm">Visiblity</span>
                 <span className="text-xs font-bold px-2 py-0.5 rounded text-primary bg-primary/10">Public</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-muted text-sm">Member Retention</span>
                 <span className="text-xs font-bold px-2 py-0.5 rounded text-accent bg-accent/10">High</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
