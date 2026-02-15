import { useState } from "react";
import Sidebar from "./Sidebar";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!groupName || !subject || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));

      const res = await fetch("http://localhost:3000/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupName,
          subject,
          description,
          createdBy: storedUser._id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Group Created Successfully ✅");

      setGroupName("");
      setSubject("");
      setDescription("");

      window.location.href = "/findgroup";

    } catch (error) {
      console.log("CREATE GROUP ERROR:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">

        {/* ===== Hero Banner (Same Style as Home) ===== */}
        <div className=" p-6">
          <h1 className="text-3xl font-bold mb-2">Create a New Study Group 🚀</h1>
          <p className="text-indigo-100">
            Start your own learning community and grow together.
          </p>
        </div>

        {/* ===== Form Card ===== */}
        <div className="bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-8">

          <h2 className="text-xl font-bold border-b-4 border-indigo-400 inline-block mb-8">
            Basic Information
          </h2>

          <div className="space-y-6">

            {/* Group Name */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Group Name *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Computer Science, Math, Python..."
                className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Description *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your study group..."
                className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium transition shadow-lg shadow-indigo-600/20"
            >
              Create Group
            </button>

            <button
              onClick={() => {
                setGroupName("");
                setSubject("");
                setDescription("");
              }}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
