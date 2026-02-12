import {
  LayoutDashboard as DashboardIcon,
  Search,
  PlusCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  Hourglass,
  TrendingUp,
  MessageSquare,
  Calendar,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-[#111827] border-r border-gray-800 flex flex-col justify-between p-6 lg:block hidden">

        {/* Logo */}
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-indigo-400">
              StudyGroup
            </h1>
            <p className="text-xs text-gray-500">
              Find your study tribe
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <SidebarItem icon={DashboardIcon} label="Dashboard" active />
            <SidebarItem icon={Search} label="Find Groups" />
            <SidebarItem icon={PlusCircle} label="Create Group" />
            <SidebarItem icon={Bell} label="Notifications" />
            <SidebarItem icon={User} label="Profile" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-900/10 cursor-pointer transition">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">

        {/* ===== Hero Banner ===== */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John Doe👋</h1>
          <p className="text-indigo-100 mb-6">Ready to continue your learning journey?</p>

          <div className="flex flex-wrap gap-3">
            <button className="bg-black/30 hover:bg-black/40 px-4 py-2 text-base rounded-lg inline-flex items-center gap-2 font-medium transition">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Group
            </button>

            <button className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 text-base  rounded-lg inline-flex items-center gap-2 font-medium transition">
              <Search className="w-5 h-5 mr-2" />
              Find Groups
            </button>
          </div>
        </div>

        {/* ===== Stats Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            value="5"
            label="Groups Joined"
            color="text-indigo-500"
          />
          <StatCard
            icon={PlusCircle}
            value="2"
            label="Groups Created"
            color="text-green-500"
          />
          <StatCard
            icon={Hourglass}
            value="3"
            label="Pending Requests"
            color="text-yellow-500"
          />
          <StatCard
            icon={TrendingUp}
            value="24"
            label="Study Hours"
            color="text-gray-400"
          />
        </div>

        {/* ===== Bottom Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== My Study Groups ===== */}
          <div className="lg:col-span-2 bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                My Study Groups
              </h3>
              <button className="text-indigo-400 text-sm hover:underline">
                View All
              </button>
            </div>

            <StudyGroupCard
              title="Advanced Calculus"
              category="Mathematics"
              time="Today, 4:00 PM"
              members="12"
              updates="3"
            />

            <StudyGroupCard
              title="Physics 101"
              category="Physics"
              time="Tomorrow, 2:00 PM"
              members="8"
              updates="5"
            />

            <StudyGroupCard
              title="Machine Learning"
              category="Computer Science"
              time="Wed, 6:00 PM"
              members="15"
            />
          </div>

          {/* ===== Recent Activity ===== */}
          <div className="bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">
              Recent Activity
            </h3>

            <ActivityItem
              icon={Users}
              color="text-indigo-500"
              text='Joined "Advanced Calculus Study Group"'
              time="2 hours ago"
            />
            <ActivityItem
              icon={MessageSquare}
              color="text-purple-500"
              text='New message in "Physics 101"'
              time="5 hours ago"
            />
            <ActivityItem
              icon={PlusCircle}
              color="text-indigo-400"
              text='Created "Machine Learning Study Group"'
              time="1 day ago"
            />
            <ActivityItem
              icon={Calendar}
              color="text-blue-400"
              text="Upcoming session: Linear Algebra"
              time="Tomorrow at 3 PM"
            />
          </div>
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${active
        ? "bg-indigo-900/40 text-indigo-400"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-[#1e2530] border border-gray-800 rounded-xl p-6">
      <div className={`p-2 rounded-lg w-fit bg-opacity-10 mb-4 ${color} bg-white/5`}>
        <Icon size={22} className={color} />
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function StudyGroupCard({ title, category, time, members, updates }) {
  return (
    <div className="bg-[#1e2530]/40 border border-gray-800 rounded-xl p-5 mb-4 hover:border-gray-700 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            {updates && (
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                {updates} new
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{category}</p>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <Users size={16} className="mr-1" />
          {members}
        </div>
      </div>

      <div className="flex items-center text-gray-400 text-xs">
        <Calendar size={14} className="mr-2" />
        Next session: {time}
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, color, text, time }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon size={16} className={color} />
      </div>
      <div>
        <p className="text-gray-300 text-sm">{text}</p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
