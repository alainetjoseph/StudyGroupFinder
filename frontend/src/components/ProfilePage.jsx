import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Profile() {

  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    subjects: [],
  });

  // Fetch profile
  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.log(err));
  }, []);

  const toggleEdit = async () => {

    if (isEditing) {

      await fetch(`http://localhost:3000/profile/${storedUser._id}`, {
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

      alert("Profile Updated Successfully");
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
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">

      <Sidebar />

      <main className="flex-1 px-16 py-14 bg-gradient-to-br from-[#0B1220] via-[#0E1626] to-[#0B1220]">

        <div className="flex gap-8">

          <div className="flex-1 bg-[#182235] border border-gray-700 rounded-2xl p-10 shadow-xl">

            {/* Header */}
            <div className="flex items-center gap-6">

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-bold">
                {userData.name?.charAt(0)}
              </div>

              <div>

                <h2 className="text-2xl font-bold">{userData.name}</h2>

                <p className="text-gray-400">{userData.email}</p>

                <button
                  onClick={toggleEdit}
                  className={`mt-3 px-4 py-2 rounded-lg text-sm ${isEditing
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>

              </div>

            </div>

            <div className="border-t border-gray-700 my-8"></div>

            <div className="space-y-6">

              {/* Name */}

              <div>

                <label className="block text-sm mb-2 text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={userData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              {/* Bio */}

              <div>

                <label className="block text-sm mb-2 text-gray-300">
                  Bio
                </label>

                <textarea
                  rows="4"
                  value={userData.bio}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, bio: e.target.value })
                  }
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              {/* Subjects */}

              <div>

                <label className="block text-sm mb-3 text-gray-300">
                  Subjects of Interest
                </label>

                <div className="flex flex-wrap gap-3">

                  {userData.subjects.map((subject) => (

                    <span
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-4 py-2 rounded-lg text-sm ${userData.subjects.includes(subject)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300"
                        } ${isEditing ? "cursor-pointer" : "opacity-60"}`}
                    >
                      {subject}
                    </span>

                  ))}

                </div>

                {isEditing && (

                  <div className="flex gap-3 mt-4">

                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Add new subject"
                      className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                      onClick={addNewSubject}
                      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                    >
                      Add
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
