import React from "react";
import { MessageCircle, Users, Calendar, LogOut } from "lucide-react";

export default function StudyGroupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 border-r border-slate-800 p-6 justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-indigo-400">StudyGroup</h1>
            <p className="text-sm text-slate-400">Find your study tribe</p>
          </div>

          <nav className="space-y-4 text-slate-300">
            {[
              "Dashboard",
              "Find Groups",
              "Create Group",
              "Notifications",
              "Profile",
              "Settings",
            ].map((item) => (
              <div
                key={item}
                className="hover:text-white cursor-pointer transition"
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 text-red-400 cursor-pointer">
          <LogOut size={18} />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* Hero Section */}
        <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Advanced Calculus Study Group
              </h2>
              <p className="mt-4 text-white/80 max-w-2xl">
                Deep dive into limits, derivatives, and integrals. We cover
                topics from Calculus II and III, work on problem sets
                together, and prepare for exams collaboratively.
              </p>

              <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Users size={16} /> 12/15 members
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> Tuesdays & Thursdays, 7–9 PM
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition">
                <MessageCircle size={18} /> Open Chat
              </button>
              <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition">
                Leave Group
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pinned Messages */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Pinned Messages</h3>

              <div className="space-y-4">
                <div className="border border-amber-500/40 rounded-xl p-4 bg-slate-800">
                  <p>
                    Welcome to the group! Please introduce yourself and share
                    what topics you want to focus on.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Sarah Johnson • 2 days ago
                  </p>
                </div>

                <div className="border border-amber-500/40 rounded-xl p-4 bg-slate-800">
                  <p>
                    Study materials for this week uploaded to shared folder.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Michael Chen • 1 day ago
                  </p>
                </div>
              </div>
            </section>

            {/* Upcoming Sessions */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Upcoming Sessions
              </h3>

              <div className="space-y-4">
                {["Derivatives Review", "Integration Techniques", "Practice Problem Sets"].map((title, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-700 hover:border-indigo-500 transition rounded-xl p-4 bg-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-slate-400">
                        Jan {16 + idx * 2} • 7:00 PM - 9:00 PM
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                      Study Session
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Members */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Members (6)</h3>
              <div className="space-y-4">
                {[
                  "Sarah Johnson",
                  "Michael Chen",
                  "Emily Davis",
                  "James Wilson",
                  "Sophia Martinez",
                  "Daniel Lee",
                ].map((member) => (
                  <div key={member} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                      {member.charAt(0)}
                    </div>
                    <span className="text-slate-300">{member}</span>
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
