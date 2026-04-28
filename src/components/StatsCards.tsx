// StatsCards.tsx
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import {
  Package,
  MessageCircle,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function StatsCards() {

  const [totalprod, setTotalProd] = useState(0);
  const navigate = useNavigate();

  const cards = [
    {
      
      title: "Products Listed",
      value: totalprod,
      icon: Package,
      gradient: "from-purple-500 to-purple-700",
      route: '/allprod'
    },
    {
      title: "Enquiries",
      value: 0,
      icon: MessageCircle,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "New Orders",
      value: 0,
      icon: ShoppingCart,
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Completed Orders",
      value: 0,
      icon: CheckCircle,
      gradient: "from-pink-500 to-pink-700",
    },
  ];
  useEffect(() => {

    getProducts();
  }, []);
  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products`)
      setTotalProd(res.data.data.length);

    } catch (error) {
      console.error(error);

    }
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;

        return (
          <Card
            key={i}
             onClick={() => navigate(c.route)} 
            className={`bg-gradient-to-r ${c.gradient} text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardContent className="p-5 flex items-center justify-between">

              {/* Left */}
              <div>
                <p className="text-sm opacity-80">{c.title}</p>
                <h2 className="text-2xl font-bold mt-1">{c.value}</h2>
              </div>

              {/* Right Icon */}
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Icon size={22} />
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}