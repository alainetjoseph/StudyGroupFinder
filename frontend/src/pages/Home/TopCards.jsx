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
  }

  const styleMap = {
    joined: "text-primary",
    created: "text-success",
  };
  function StatCard({ icon: Icon, value, label, type }) {
    const color = styleMap[type];

    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="p-2 rounded-lg w-fit mb-4 bg-card">
          <Icon size={22} className={color} />
        </div>

        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        <p className="text-muted text-sm">{label}</p>
      </div>
    );
  }
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/topcards`, { id: user._id }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        setCards(res.data.cards)
      })
  }, [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
