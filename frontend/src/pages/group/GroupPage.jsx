import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";

import { Users, MoreVertical, Flag, FileText, Image as ImageIcon, FileSpreadsheet, Presentation, File } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import { AuthContext } from "../../contexts/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";
import ReportModal from "../../components/ReportModal";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import { useGroupChat } from "../../hooks/useGroupChat";
import { useMaterials } from "../../hooks/useMaterials";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Skeleton = ({ className }) => (
  <div className={`bg-card animate-pulse rounded-lg ${className}`} />
);

export default function StudyGroupPage() {
  const { user } = useContext(AuthContext);
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const {
    messages,
    setMessages,
    sendMessage: sendSocketMessage,
    loadingMessages
  } = useGroupChat(groupId, user);

  const {
    materials,
    uploading,
    uploadProgress,
    uploadMaterial
  } = useMaterials(groupId);

  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  const [editingMsg, setEditingMsg] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [reportTarget, setReportTarget] = useState({
    id: null,
    type: null
  });

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const materialsRef = useRef(null);
  const lastMessageRef = useRef(null);
  const inputRef = useRef(null);
  const isMember = group?.members?.some((m) => String(m._id || m) === String(user?._id));

  async function handleJoinGroup() {
    try {
      await axios.post(
        `${BACKEND}/groups/join-group`,
        { groupId, userId: user._id },
        { withCredentials: true }
      );
      enqueueSnackbar("Joined group!", { variant: "success" });
      // Connect socket after successful join/auth
      connectSocket();
      // Refresh group data to update membership status
      const res = await axios.get(`${BACKEND}/groups/${groupId}`, { withCredentials: true });
      setGroup(res.data.group);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Cannot join group";
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
  }

  /* ================= FETCH GROUP ================= */
  useEffect(() => {
    if (!groupId) return;

    axios
      .get(`${BACKEND}/groups/${groupId}`, { withCredentials: true })
      .then((res) => {
        setGroup(res.data.group);
        setLoading(false);
        // Connect socket if user is already a member
        const isUserMember = res.data.group?.members?.some((m) => String(m._id || m) === String(user?._id));
        if (isUserMember) {
          connectSocket();
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("Try refreshing the page", { variant: "error" });
      });

    return () => {
      disconnectSocket();
    };
  }, [groupId, user?._id]);

  /* ================= MATERIAL COUNT MAP ================= */
  const materialCountMap = useMemo(() => {
    const counts = {};
    materials.forEach((m) => {
      if (m.messageId) {
        counts[m.messageId] = (counts[m.messageId] || 0) + 1;
      }
    });
    return counts;
  }, [materials]);

  /* ================= SMART AUTO SCROLL ================= */

  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Smart scroll: only scroll if user was already near bottom
    const isNearBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight <
      150;

    if (isNearBottom || messages.some(m => m.optimistic)) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  /* ================= CLICK OUTSIDE MENU ================= */
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (editingMsg) {
      try {
        const res = await axios.put(
          `${BACKEND}/groups/message/edit/${editingMsg._id}`,
          { text: newMessage },
          { withCredentials: true }
        );

        setMessages(prev =>
          prev.map(m =>
            m._id === editingMsg._id
              ? { ...m, text: res.data.message.text, edited: true }
              : m
          )
        );

        setEditingMsg(null);
        setNewMessage("");
        enqueueSnackbar("Message edited", { variant: "success" });
        return;
      } catch {
        enqueueSnackbar("Edit failed", { variant: "error" });
      }
    }

    let isQuestion = false;
    let text = newMessage;

    if (newMessage.trim().startsWith("/q ")) {
      isQuestion = true;
      text = newMessage.replace("/q ", "");
    }

    sendSocketMessage({ text, isQuestion });
    setNewMessage("");
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileUpload = async (e, directMessageId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Pass directMessageId if available (from "Upload Solution") or use state
    // passing it directly avoids stale state issues
    await uploadMaterial(file, directMessageId || selectedMessageId);
    
    setSelectedMessageId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= MATERIAL SCROLL ================= */
  const goToMaterial = (messageId) => {
    const hasMaterials = materials.some((m) => m.messageId === messageId);
    if (!hasMaterials) return;

    setSelectedMessageId(messageId);
    materialsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ================= FILE ICON ================= */
  const getFileIcon = (filename = "") => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText size={18} className="text-red-400" />;
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <ImageIcon size={18} className="text-green-400" />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FileSpreadsheet size={18} className="text-emerald-400" />;
    if (["ppt", "pptx"].includes(ext)) return <Presentation size={18} className="text-orange-400" />;
    return <File size={18} className="text-slate-400" />;
  };

  /* ================= EDIT MESSAGE ================= */
  const handleEdit = (msg) => {
    setEditingMsg(msg);
    setNewMessage(msg.text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND}/groups/message/delete/${id}`, { withCredentials: true });
      setMessages(prev => prev.filter(m => m._id !== id));
      enqueueSnackbar("Message deleted", { variant: "success" });
    } catch {
      enqueueSnackbar("Delete failed", { variant: "error" });
    }
  };

  /* ================= REPORT ================= */
  const reportUser = (id) => {
    setReportTarget({ id, type: "user" });
    setReportOpen(true);
  };

  const reportMessage = (id) => {
    setReportTarget({ id, type: "message" });
    setReportOpen(true);
  };

  const isQuestionTyping = newMessage.startsWith("/q ");

  function handleConfirm() {
    axios.post(`${BACKEND}/groups/leave`, { groupId }, { withCredentials: true })
      .then(() => {
        enqueueSnackbar("You’ve left the group.", { variant: "success" });
        navigate("/");
      })
      .catch(() => {
        enqueueSnackbar("Error leaving group", { variant: "error" });
      })
      .finally(() => setOpen(false));
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="rounded-2xl p-6 sm:p-8 bg-linear-to-r from-primary to-purple-600 shadow-xl flex flex-col md:flex-row justify-between items-start gap-6 text-foreground">
        <div className="max-w-prose">
          <h2 className="text-2xl md:text-3xl font-bold break-words">
            {loading ? <Skeleton className="h-10 w-72" /> : group?.groupName}
          </h2>
          <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed">
            {group?.description}
          </p>
          {group?.isLocked && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-100 rounded-lg text-sm border border-red-500/30">
              🔒 Locked by Admin
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-5 text-sm font-medium">
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full">
              <Users size={16} />
              {group?.members?.length || 0} Members
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setReportTarget({ id: group?._id, type: "group" });
              setReportOpen(true);
            }}
            className="flex-1 md:flex-none px-5 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-xl text-sm font-semibold transition"
          >
            Report Group
          </button>
          {isMember ? (
            <button
              onClick={() => setOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 hover:bg-red-700 text-foreground rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition active:scale-95"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoinGroup}
              disabled={group?.isLocked}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition active:scale-95
                ${group?.isLocked
                  ? "bg-card text-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover text-foreground shadow-primary/20"
                }`}
            >
              {group?.isLocked ? "Locked" : "Join Group"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* CHAT */}
        <div className="lg:col-span-3">
          {!isMember && !loading ? (
            <div className="bg-card border border-border rounded-3xl p-12 sm:p-20 text-center shadow-xl flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-600/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-8 mx-auto ring-4 ring-[var(--color-accent-primary)]/10">
                  <Users size={32} className="text-primary" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                  Private Study Group
                </h3>

                <p className="text-muted text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  This group's discussions and materials are private. Join the community to collaborate and access shared resources.
                </p>

                <button
                  onClick={handleJoinGroup}
                  disabled={group?.isLocked}
                  className={`px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-95 flex items-center gap-3 mx-auto
                    ${group?.isLocked
                      ? "bg-card text-muted cursor-not-allowed"
                      : "bg-primary hover:bg-primary-hover text-foreground shadow-primary/40 hover:shadow-primary/60"
                    }`}
                >
                  {group?.isLocked ? "Group Locked" : "Join Group Now"}
                </button>
              </div>
            </div>
          ) : (
            <section className="bg-card border border-border rounded-3xl p-4 sm:p-6 flex flex-col h-[600px] shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Group Chat <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </h3>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
              >
                {messages.map((msg, index) => {
                  const isMe = String(msg.sender?._id || msg.sender) === String(user?._id);
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative group max-w-[85%] sm:max-w-md px-4 py-3 rounded-2xl border transition-all duration-200
                          ${msg.optimistic ? "opacity-60" : ""}
                          ${msg.isQuestion
                            ? "bg-warning/10 border-warning text-warning-contrast shadow-lg shadow-warning-base/5"
                            : isMe
                              ? "bg-primary text-foreground border-accent-primary shadow-lg shadow-primary/20"
                              : "bg-background border-border hover:border-border-muted"
                          }`}
                      >
                        <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === msg._id ? null : msg._id);
                            }}
                            className="text-muted hover:text-foreground p-1 rounded-lg hover:bg-text-primary/10"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {openMenuId === msg._id && (
                          <div className={`absolute ${isMe ? "right-0" : "left-0"} top-10 w-32 bg-card border border-border rounded-xl shadow-2xl z-30 overflow-hidden`}>
                            {isMe && !group?.isLocked ? (
                              <>
                                <button
                                  onClick={() => { handleEdit(msg); setOpenMenuId(null); }}
                                  className="block w-full text-left px-3 py-2.5 text-sm hover:bg-card transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => { handleDelete(msg._id); setOpenMenuId(null); }}
                                  className="block w-full text-left px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => { reportMessage(msg._id); setOpenMenuId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-card transition"
                              >
                                <Flag size={14} /> Report
                              </button>
                            )}
                          </div>
                        )}

                        {!isMe && (
                          <p className="text-xs font-bold text-primary mb-1">
                            {msg.sender?.name}
                          </p>
                        )}

                        {msg.isQuestion && (
                          <div className="inline-block text-[10px] px-2 py-0.5 mb-2 rounded bg-warning/20 text-warning-contrast font-bold uppercase tracking-wider">
                            ❓ Question
                          </div>
                        )}

                        <p
                          onClick={() => goToMaterial(msg._id)}
                          className="text-[15px] sm:text-base cursor-pointer hover:underline underline-offset-4 decoration-primary break-words leading-relaxed"
                        >
                          {msg.text}
                          {msg.edited && (
                            <span className="text-[10px] ml-2 opacity-40">(edited)</span>
                          )}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {msg.createdAt && (
                            <p className="text-[10px] text-muted opacity-60">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <div className="flex gap-2">
                            {isMember && msg.isQuestion && !group?.isLocked && (
                              <button
                                onClick={() => { setSelectedMessageId(msg._id); fileInputRef.current.click(); }}
                                className="text-[10px] font-bold text-primary hover:text-primary-hover transition"
                              >
                                Upload Solution
                              </button>
                            )}
                            {materialCountMap[msg._id] > 0 && (
                              <p className="text-[10px] font-bold text-primary">
                                📎 {materialCountMap[msg._id]} material{materialCountMap[msg._id] > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              {group?.isLocked ? (
                <div className="mt-6 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-center">
                  <p className="text-red-400 font-medium flex items-center justify-center gap-2">
                    🔒 Locked by Admin
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  {uploading && (
                    <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-4 transition-all duration-300">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-primary/70 mb-1 uppercase tracking-tighter">
                          Uploading Material ({uploadProgress}%)
                        </p>
                        <div className="w-full bg-card rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className={`w-full bg-input-background border rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:ring-2 transition shadow-inner
                      ${isQuestionTyping
                            ? "border-warning/50 ring-warning-base/20"
                            : "border-border ring-[var(--color-accent-primary)]/20"
                          }`}
                        placeholder="Ask a question with /q ..."
                      />
                    </div>

                    <button
                      onClick={sendMessage}
                      className="bg-primary hover:bg-primary-hover text-foreground px-5 sm:px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center shrink-0"
                    >
                      Send
                    </button>

                    <input ref={fileInputRef} type="file" onChange={(e) => handleFileUpload(e)} className="hidden" />
                    <button
                      onClick={() => { setSelectedMessageId(null); fileInputRef.current.click(); }}
                      disabled={uploading}
                      className="p-3.5 bg-background border border-border rounded-xl hover:border-accent-primary transition disabled:opacity-50 shrink-0"
                    >
                      📎
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* SIDE BAR (Materials & Members) */}
        <div className="space-y-8">
          {/* MATERIALS */}
          {isMember && (
            <section ref={materialsRef} className="bg-card border border-border rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                Materials
                <span className="text-[10px] bg-primary/20 text-primary px-2.5 py-1 rounded-full">{materials.length}</span>
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {materials.length === 0 ? (
                  <p className="text-center text-muted text-sm py-4">No materials yet.</p>
                ) : (
                  materials.map((file) => (
                    <div
                      key={file._id}
                      className={`flex flex-col gap-2 p-3 rounded-xl border transition
                      ${file.messageId === selectedMessageId ? "bg-primary/20 border-accent-primary" : "bg-background border-border"}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0">{getFileIcon(file.originalName)}</div>
                        <span className="text-xs font-medium truncate">{file.originalName}</span>
                      </div>
                      {isMember && (
                        <a
                          href={`${BACKEND}/groups/materials/${file._id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-primary hover:text-primary-hover text-right uppercase tracking-wider"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* MEMBERS */}
          {isMember && (
            <section className="bg-card border border-border rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                Members
                <span className="text-[10px] bg-primary/20 text-primary px-2.5 py-1 rounded-full">{group?.members?.length || 0}</span>
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {group?.members?.map((member) => (
                  <div key={member._id} className="group flex justify-between items-center bg-background border border-border p-3 rounded-xl hover:border-border-muted transition">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0 text-foreground">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium truncate text-foreground">{member.name} {member._id === user?._id && <span className="text-[10px] text-primary">(You)</span>}</span>
                    </div>
                    {member._id !== user?._id && (
                      <button
                        onClick={() => reportUser(member._id)}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-destructive text-[10px] font-bold uppercase transition hover:text-destructive/80"
                      >
                        Report
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ConfirmModal
        open={open}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
        title="Exit Study Group?"
        desc="You will lose access to all chat history and study materials shared in this group."
        buttonName="Leave Group"
      />

      <ReportModal
        open={reportOpen}
        setOpen={setReportOpen}
        targetId={reportTarget?.id}
        targetType={reportTarget?.type}
      />
    </div>
  );
}