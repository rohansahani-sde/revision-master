import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="flex-1 flex flex-col text-gray-800">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
