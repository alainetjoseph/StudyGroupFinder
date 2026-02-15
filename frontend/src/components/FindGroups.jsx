import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import Sidebar from "./Sidebar";

export default function FindGroups() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/groups")
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.log("FETCH GROUPS ERROR:", err));
  }, []);

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">

        {/* ===== Hero Banner ===== */}
        <div className=" rounded-2xl p-6">
          <h1 className="text-3xl font-bold mb-2">
            Find Study Groups 🔎
          </h1>
          <p className="text-indigo-100">
            Discover communities that match your learning goals.
          </p>
        </div>

        {/* ===== Search Card ===== */}
        <div className="bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6">

          <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg px-4 py-3">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by group name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
            />
          </div>

          <div className="mt-4 text-sm text-gray-400">
            {filteredGroups.length} groups found
          </div>
        </div>

        {/* ===== Group Grid ===== */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No groups found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">
                    {group.groupName}
                  </h2>

                  <span className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
                    {group.subject}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-6">
                  {group.description}
                </p>

                {/* Members */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <Users size={16} />
                  {group.members.length} members
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition shadow-md shadow-indigo-600/20">
                    Join Group
                  </button>

                  <button className="px-4 py-2 bg-[#111827] hover:bg-gray-700 border border-gray-700 rounded-lg transition">
                    View
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
