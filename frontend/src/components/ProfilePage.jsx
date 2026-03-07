import React, { useState, useEffect } from "react";
// Sidebar is now handled by Layout
import { enqueueSnackbar } from "notistack";

export default function Profile() {

  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    subjects: [],
  });

  // Fetch profile
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar("Failed to fetch profile", { variant: "error" });
        setLoading(false);
      });
  }, []);

  const toggleEdit = async () => {

    if (isEditing) {
      setSaving(true);
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/${storedUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: userData.name,
            bio: userData.bio,
            subjects: userData.subjects
          })
        });

        enqueueSnackbar("Profile Updated Successfully", { variant: "success" });
      } catch (err) {
        enqueueSnackbar("Failed to update profile", { variant: "error" });
      } finally {
        setSaving(false);
      }
    }

    setIsEditing(!isEditing);
  };

  const toggleSubject = (subject) => {

    if (!isEditing) return;

    if (userData.subjects.includes(subject)) {

      setUserData({
        ...userData,
        subjects: userData.subjects.filter((s) => s !== subject)
      });

    } else {

      setUserData({
        ...userData,
        subjects: [...userData.subjects, subject]
      });

    }
  };

  const addNewSubject = () => {

    if (!newSubject.trim()) return;

    if (!userData.subjects.includes(newSubject)) {

      setUserData({
        ...userData,
        subjects: [...userData.subjects, newSubject]
      });

    }

    setNewSubject("");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Header Section */}
        {loading ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-[var(--color-border-base)]"></div>
            <div className="space-y-3 w-full max-w-xs text-center sm:text-left">
              <div className="w-48 h-8 bg-[var(--color-border-base)] rounded mx-auto sm:mx-0"></div>
              <div className="w-32 h-4 bg-[var(--color-border-base)] rounded mx-auto sm:mx-0"></div>
              <div className="w-24 h-8 bg-[var(--color-border-base)] rounded mt-2 mx-auto sm:mx-0"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl sm:text-5xl font-bold text-foreground shadow-2xl relative">
              {userData.name?.charAt(0)}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-4 border-[var(--color-bg-card)] rounded-full"></div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-bold mb-1 break-words">{userData.name}</h2>
              <p className="text-muted mb-6 font-medium">{userData.email}</p>

              <button
                onClick={toggleEdit}
                disabled={saving}
                className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                  isEditing
                    ? "bg-success hover:brightness-110 text-foreground shadow-lg shadow-[var(--color-success)]/20"
                    : "bg-primary hover:bg-primary-hover text-foreground shadow-lg shadow-primary/20"
                }`}
              >
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-border/50 my-10"></div>

        <div className="space-y-8">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={userData.name}
                disabled={!isEditing}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted uppercase tracking-widest ml-1">Bio</label>
              <textarea
                rows="3"
                value={userData.bio}
                disabled={!isEditing}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="w-full bg-input-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-muted uppercase tracking-widest ml-1">Subjects of Interest</label>
            <div className="flex flex-wrap gap-2.5">
              {userData.subjects.map((subject) => (
                <span
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    userData.subjects.includes(subject)
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-[var(--color-border-base)] text-muted border border-transparent"
                  } ${isEditing ? "cursor-pointer hover:bg-primary/30 active:scale-95" : "opacity-60"}`}
                >
                  {subject} {isEditing && "×"}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Quantum Physics"
                  onKeyDown={(e) => e.key === 'Enter' && addNewSubject()}
                  className="flex-1 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition text-foreground"
                />
                <button
                  onClick={addNewSubject}
                  className="bg-border-muted hover:hover:bg-border px-6 py-2.5 rounded-xl text-sm font-bold text-foreground transition active:scale-95"
                >
                  Add Topic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
