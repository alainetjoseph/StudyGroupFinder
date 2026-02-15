import {
  Users,
  Calendar,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TopCards from "./TopCards";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const { user } = useContext(AuthContext)
  const [joinedGroups, setJoinedGroups] = useState([])
  useEffect(() => {
    if (!user._id) {
      return
    }
    axios.post("http://localhost:3000/joined-groups", {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data.groups);
        setJoinedGroups(res.data.groups);
      })
  }, [user])
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />
      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">

        {/* ===== Hero Banner ===== */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-3 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}👋</h1>
          <p className="text-indigo-100 mb-3">Ready to continue your learning journey?</p>

        </div>

        {/* ===== Stats Grid ===== */}
        <TopCards />

        {/* ===== Bottom Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

          {/* ===== My Study Groups ===== */}
          <div className="lg:col-span-2 bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold border-b-4 border-indigo-400 inline-block">
                My Study Groups
              </h3>
            </div>
            {joinedGroups.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg font-medium">
                  No groups joined yet
                </p>
              </div>
            ) : (
              joinedGroups.map((item) => (
                <StudyGroupCard
                  key={item._id}
                  title={item.groupName}
                />
              ))
            )}
            {/**/}
            {/* <StudyGroupCard */}
            {/*   title="Physics 101" */}
            {/*   category="Physics" */}
            {/*   time="Tomorrow, 2:00 PM" */}
            {/*   members="8" */}
            {/*   updates="5" */}
            {/* /> */}
            {/**/}
            {/* <StudyGroupCard */}
            {/*   title="Machine Learning" */}
            {/*   category="Computer Science" */}
            {/*   time="Wed, 6:00 PM" */}
            {/*   members="15" */}
            {/* /> */}
          </div>

          {/* ===== Recent Activity ===== */}
          {/* <div className="bg-[#1e2530]/60 border border-gray-800 rounded-2xl p-6"> */}
          {/*   <h3 className="text-xl font-bold mb-6"> */}
          {/*     Recent Activity */}
          {/*   </h3> */}
          {/**/}
          {/*   <ActivityItem */}
          {/*     icon={Users} */}
          {/*     color="text-indigo-500" */}
          {/*     text='Joined "Advanced Calculus Study Group"' */}
          {/*     time="2 hours ago" */}
          {/*   /> */}
          {/*   <ActivityItem */}
          {/*     icon={MessageSquare} */}
          {/*     color="text-purple-500" */}
          {/*     text='New message in "Physics 101"' */}
          {/*     time="5 hours ago" */}
          {/*   /> */}
          {/*   <ActivityItem */}
          {/*     icon={PlusCircle} */}
          {/*     color="text-indigo-400" */}
          {/*     text='Created "Machine Learning Study Group"' */}
          {/*     time="1 day ago" */}
          {/*   /> */}
          {/*   <ActivityItem */}
          {/*     icon={Calendar} */}
          {/*     color="text-blue-400" */}
          {/*     text="Upcoming session: Linear Algebra" */}
          {/*     time="Tomorrow at 3 PM" */}
          {/*   /> */}
          {/* </div> */}
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */



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
          {/* <p className="text-gray-500 text-sm">{category}</p> */}
        </div>

        {/* <div className="flex items-center text-gray-400 text-sm"> */}
        {/*   <Users size={16} className="mr-1" /> */}
        {/*   {members} */}
        {/* </div> */}
      </div>

      {/* <div className="flex items-center text-gray-400 text-xs"> */}
      {/*   <Calendar size={14} className="mr-2" /> */}
      {/*   Next session: {time} */}
      {/* </div> */}
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
