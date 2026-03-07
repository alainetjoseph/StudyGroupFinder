import {
  Users,
  Calendar,
  Group,
} from "lucide-react";
// Sidebar is now handled by Layout
import TopCards from "./TopCards";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user._id) {
      return
    }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/joined-groups`, {}, { withCredentials: true })
      .then((res) => {
        setJoinedGroups(res.data.groups);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
  return (
    <div className="space-y-8 max-w-full">

      {/* ===== Hero Banner ===== */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-foreground shadow-lg shadow-primary-glow">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}👋</h1>
          <p className="text-foreground/80 mb-3">Ready to continue your learning journey?</p>

        </div>

        {/* ===== Stats Grid ===== */}
        <TopCards />

        {/* ===== Bottom Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

          {/* ===== My Study Groups ===== */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold border-b-4 border-primary inline-block">
                My Study Groups
              </h3>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl h-20 animate-pulse"></div>
                ))}
              </div>
            ) : joinedGroups.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted text-lg font-medium">
                  No groups joined yet
                </p>
              </div>
            ) : (
              joinedGroups.map((item) => (
                <StudyGroupCard
                  key={item._id}
                  title={item.groupName}
                  category={item.subject}
                  members={item.members.length}
                  handleClick={() => { navigate(`/group/${item._id}`) }}
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
          {/* <div className="bg-[#1e2530]/60 border border-border rounded-2xl p-6"> */}
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
          {/*     color="text-primary" */}
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

    </div>
  );
}

/* ================= COMPONENTS ================= */



function StudyGroupCard({ title, category, time, members, updates, handleClick }) {
  return (
    <div onClick={handleClick} className="bg-card border border-border rounded-xl p-5 mb-4 hover:border-border-muted transition">
      <div className="flex justify-between items-start mb-3" >
        <div >
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            {updates && (
              <span className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded-full">
                {updates} new
              </span>
            )}
          </div>
          <p className="text-muted text-sm">{category}</p>
        </div>

        <div className="flex items-center text-muted text-sm">
          <Users size={16} className="mr-1" />
          {members}
        </div>
      </div>

      {/* <div className="flex items-center text-muted-foreground text-xs"> */}
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
        <p className="text-foreground text-sm">{text}</p>
        <p className="text-muted text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
