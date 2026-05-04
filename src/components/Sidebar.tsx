import {
    Home,
    Layers,
    ShoppingCart,
    Badge,
    Package,
    ChevronDown,
    ChevronRight,
    Users,
    Mail,
    IndianRupee,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
    const navigate = useNavigate();
    const [openOrders, setOpenOrders] = useState(false);
    const [openProducts, setOpenProducts] = useState(false);
    // const orderStatus = "confirmed"

    return (
        <div
            className={`bg-white text-gray-300 h-full flex flex-col transition-all duration-300
             ${isOpen ? "w-64" : "w-0"}`}
        >
            {/* Header */}
            <div className="p-4 text-black font-bold text-lg ">
                Bangar Admin
            </div>

            {/* Menu */}
            <nav className="flex-1 px-2 py-4 space-y-1 text-gray-600 text-sm">

                {/* Dashboard */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                    <Home size={18} />
                    Dashboard
                </div>

                {/* Category */}
                <div
                    onClick={() => navigate("/category")}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                    <Layers size={18} />
                    Category
                </div>

                {/* SubCategory */}
                <div 
                  onClick={() => navigate("/subcategory")}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <ShoppingCart size={18} />
                    SubCategory
                </div>

                {/* Brands */}
                <div 
                  onClick={() => navigate("/brands")}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Badge size={18} />
                    Brands
                </div>
                <div>

                    {/* Manage Products */}
                    <div
                        onClick={() => setOpenProducts(!openProducts)}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Package size={18} />
                            Manage Products
                        </div>
                        {openProducts ? (
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
                        )}
                    </div>
                    {/* Submenu */}
                    {openProducts && (
                        <div className="ml-8 mt-1 space-y-1 text-gray-500">
                            <div
                                onClick={() => navigate("/addprod")}
                                className="cursor-pointer hover:text-gray-600"
                            >
                                → Add New Product
                            </div>
                            <div
                                onClick={() => navigate("/allprod")}
                                className="cursor-pointer hover:text-gray-600"
                            >
                                → List Products
                            </div>
                        </div>
                    )}
                </div>

                {/* Manage Orders (Expandable) */}
                <div>
                    <div
                        onClick={() => setOpenOrders(!openOrders)}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={18} />
                            Manage Orders
                        </div>
                        {openOrders ? (
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
                        )}
                    </div>

                    {/* Submenu */}
                    {openOrders && (
                        <div className="ml-8 mt-1 space-y-2 text-gray-500">
                            <div onClick={() => navigate(`/orders/all`)} className="cursor-pointer hover:text-gray-600">→ All Orders</div>
                            {/* <div className="cursor-pointer hover:text-gray-600">→ Dispatched Orders</div>
                            <div className="cursor-pointer hover:text-gray-600">→ Delivered Orders</div>
                            <div className="cursor-pointer hover:text-gray-600">→ Completed Orders</div>
                            <div className="cursor-pointer hover:text-gray-600">→ Pending Orders</div> */}
                        </div>
                    )}
                </div>

                {/* Subscription */}
                <div  onClick={() => navigate("/subscriptions")} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <IndianRupee size={18} />
                    Subscription Plans
                </div>

                {/* Customers */}
                <div onClick={()=> navigate('/customer')} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Users size={18} />
                    Manage Customers
                </div>

                {/* Mails */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Mail size={18} />
                    Mails
                </div>

                {/* Contact */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Mail size={18} />
                    Contact Enquiries
                </div>

            </nav>
        </div>
    );
}