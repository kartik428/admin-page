import { LogOut, Menu, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ toggleSidebar }: any) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="h-16 bg-white flex items-center justify-between px-6 text-black shadow-sm">

            {/* Hamburger */}
            <button onClick={toggleSidebar}>
                <Menu size={26} />
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
                <div
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border"
                >
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="admin"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-34 bg-white rounded-md shadow-lg py-2 z-50">

                        <div className="px-4 py-2 flex justify-between hover:bg-gray-100 cursor-pointer">
                            <span>Profile</span> <User />
                        </div>

                        <div
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}
                            className="px-4 py-2 flex justify-between hover:bg-gray-100 cursor-pointer text-red-500"
                        >
                        <span>Logout</span> <LogOut/>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}