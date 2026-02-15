import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext"
import { Hourglass, PlusCircle, User } from "lucide-react";
const TopCards = () => {
  const { user } = useContext(AuthContext)
  const [cards, setCards] = useState([])
  const Icons = {
    joined: User,
    created: PlusCircle,
    pending: Hourglass
  }

  const styleMap = {
    joined: "text-indigo-500",
    created: "text-green-500",
    pending: "text-yellow-500"
  };
  function StatCard({ icon: Icon, value, label, type }) {
    const color = styleMap[type];

    return (
      <div className="bg-[#1e2530] border border-gray-800 rounded-xl p-6">
        <div className="p-2 rounded-lg w-fit mb-4 bg-white/5">
          <Icon size={22} className={color} />
        </div>

        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    );
  }
  useEffect(() => {
    axios.post(`http://localhost:3000/topcards`, { id: user._id }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        setCards(res.data.cards)
      })
  }, [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((item) => (
        <StatCard
          key={item.type}
          label={item.title}
          value={item.count}
          type={item.type}
          icon={Icons[item.type]}
        />
      ))}
    </div>
  )
}

export default TopCards
