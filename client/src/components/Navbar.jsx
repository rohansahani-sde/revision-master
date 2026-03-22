import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';
import logo from '/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-4">
                    <img src={logo} className="h-16 w-auto object-contain drop-shadow-md" alt="Smart Revision Logo" />
                    <div className="hidden sm:block">
                        <h1 className="text-[#4C4D4F] font-bold text-lg leading-tight tracking-tight">
                            Smart<span className="text-[#F1BB18]">Revision</span>
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">Where Revision Meets Intelligence</p>
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/" className="text-gray-700 font-medium hover:text-[#F1BB18] transition-colors">Home</Link>
                <Link to="/flashcard" className="text-gray-700 font-medium hover:text-[#F1BB18] transition-colors">Flashcards</Link>
                <Link to="/report" className="text-gray-700 font-medium hover:text-[#F1BB18] transition-colors">Report</Link>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm pl-1.5 pr-4 py-1.5 rounded-full cursor-default hover:border-teal-300 transition-colors">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-500 to-[#F1BB18] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <span className="text-sm font-bold text-gray-700 tracking-tight">
                            {user?.name || "Student"}
                        </span>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors group" title="Logout">
                        <MdLogout className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
