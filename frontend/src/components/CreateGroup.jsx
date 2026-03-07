import { useState } from "react";
// Sidebar is now handled by Layout
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!groupName || !subject || !description) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const storedUser = JSON.parse(sessionStorage.getItem("user"));

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/groups/create`, {
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
        enqueueSnackbar(data.message, { variant: "error" });
        return;
      }

      enqueueSnackbar("Group Created Successfully", { variant: "success" });

      setGroupName("");
      setSubject("");
      setDescription("");

      navigate("/findgroup");

    } catch (error) {
      console.log("CREATE GROUP ERROR:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* ===== Hero Banner ===== */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-foreground shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Create a New Study Group 🚀</h1>
        <p className="text-muted text-sm md:text-base">
          Start your own learning community and grow together.
        </p>
      </div>

      {/* ===== Form Card ===== */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-xl font-bold border-b-4 border-[var(--color-border-accent)] inline-block mb-8 text-foreground">
          Basic Information
        </h2>

        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter a descriptive group name"
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Math, Python"
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Description *
            </label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about? What are the goals?"
              className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-12">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-foreground disabled:opacity-50 disabled:cursor-not-allowed px-10 py-3.5 rounded-xl font-bold transition shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? "Creating..." : "Create Group"}
          </button>

          <button
            onClick={() => {
              setGroupName("");
              setSubject("");
              setDescription("");
            }}
            disabled={loading}
            className="flex-1 sm:flex-none bg-border-muted hover:hover:bg-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed px-10 py-3.5 rounded-xl font-medium transition active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
