import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessageCircle, Users, Calendar } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import { io } from "socket.io-client";
import { AuthContext } from "../../contexts/AuthContext";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

const BACKEND = import.meta.env.VITE_BACKEND_URL;

/* ---------------- Skeleton Component ---------------- */

const Skeleton = ({ className }) => {
  return (
    <div
      className={`bg-slate-800 animate-pulse rounded-lg ${className}`}
    />
  );
};

/* ---------------- Main Component ---------------- */

export default function StudyGroupPage() {
  const location = useLocation();
  const { user } = useContext(AuthContext)
  const { groupId } = useParams()
  console.log(groupId)

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    if (!groupId) return;
    console.log("group calling")
    axios
      .get(`${BACKEND}/groups/${groupId}`, { withCredentials: true })
      .then((res) => {
        // Small delay for smooth UX
        setTimeout(() => {
          setGroup(res.data.group);
          console.log(res.data.group);
          setLoading(false);
        }, 400);
      })
      .catch(() => {
        setLoading(false)
        enqueueSnackbar("try again by refreshing", {
          variant: "error", anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      });
  }, [groupId]);

  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    if (!groupId) return;

    socket.emit("joinGroup", { groupId });

    axios
      .get(`${BACKEND}/groups/${groupId}/messages`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data));

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [groupId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    console.log(user)
    socket.emit("sendMessage", {
      groupId,
      userId: user,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* ================= HERO ================= */}
        <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold">
                {loading ? (
                  <Skeleton className="h-10 w-72" />
                ) : (
                  group?.groupName
                )}
              </h2>

              {/* Description */}
              <div className="mt-4 text-white/80 max-w-2xl">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : (
                  group?.description
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/90">
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {group?.members?.length || 0} members
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-36" />
                </>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition">
                    <MessageCircle size={18} /> Open Chat
                  </button>
                  <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition">
                    Leave Group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* -------- Pinned Messages -------- */}
            {/* <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"> */}
            {/*   <h3 className="text-xl font-semibold mb-6"> */}
            {/*     Pinned Messages */}
            {/*   </h3> */}
            {/**/}
            {/*   <div className="space-y-4"> */}
            {/*     {loading */}
            {/*       ? Array.from({ length: 2 }).map((_, i) => ( */}
            {/*         <div */}
            {/*           key={i} */}
            {/*           className="border border-slate-700 rounded-xl p-4 bg-slate-800" */}
            {/*         > */}
            {/*           <Skeleton className="h-4 w-full mb-2" /> */}
            {/*           <Skeleton className="h-4 w-5/6 mb-2" /> */}
            {/*           <Skeleton className="h-3 w-32" /> */}
            {/*         </div> */}
            {/*       )) */}
            {/*       : group?.pinnedMessages?.length > 0 */}
            {/*         ? group.pinnedMessages.map((msg) => ( */}
            {/*           <div */}
            {/*             key={msg._id} */}
            {/*             className="border border-amber-500/40 rounded-xl p-4 bg-slate-800" */}
            {/*           > */}
            {/*             <p>{msg.text}</p> */}
            {/*             <p className="text-sm text-slate-400 mt-2"> */}
            {/*               {msg.author} • {msg.time} */}
            {/*             </p> */}
            {/*           </div> */}
            {/*         )) */}
            {/*         : ( */}
            {/*           <p className="text-slate-400">No pinned messages</p> */}
            {/*         )} */}
            {/*   </div> */}
            {/* </section> */}

            {/* ================= GROUP CHAT ================= */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Group Chat
              </h3>

              {/* Messages */}
              <div className="h-96 overflow-y-auto space-y-4 pr-2 custom-scroll" ref={chatContainerRef}>
                {messages.length === 0 ? (
                  <p className="text-slate-400 text-sm">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id === user?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-sm px-4 py-3 rounded-2xl shadow-md transition ${isMe
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
                            }`}
                        >
                          {!isMe && (
                            <p className="text-xs text-indigo-400 font-medium mb-1">
                              {msg.sender?.name}
                            </p>
                          )}

                          <p className="text-sm leading-relaxed break-words">
                            {msg.text}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-2 text-right">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* <div ref={bottomRef} /> */}
              </div>

              {/* Input */}
              <div className="mt-6 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Type your message..."
                />

                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition shadow-md"
                >
                  Send
                </button>
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Members ({loading ? "..." : group?.members?.length || 0})
              </h3>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))
                  : group?.members?.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                        {member.name?.charAt(0)}
                      </div>
                      <span className="text-slate-300">
                        {member.name}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
