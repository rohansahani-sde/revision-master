import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Wave Separator */}
      <div className="w-full overflow-hidden leading-none rotate-180">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 fill-gray-50"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Section */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SmartRevision Logo" className="h-14 w-auto object-contain drop-shadow-lg" />
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  Smart<span className="text-[#F1BB18]">Revision</span>
                </h2>
                <p className="text-xs text-gray-400 font-medium">Where Revision Meets Intelligence</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              AI-powered study plans tailored to your learning goals. Master any topic in days, not months.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F1BB18] p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                title="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F1BB18] p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                title="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F1BB18] p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                title="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@smartrevision.app"
                className="text-gray-400 hover:text-[#F1BB18] p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                title="Email"
              >
                <MdEmail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-[#F1BB18] rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'My Report', to: '/report' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-[#F1BB18] text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 group-hover:bg-[#F1BB18] transition-colors shrink-0"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features / Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-[#F1BB18] rounded-full"></span>
              Features
            </h3>
            <ul className="space-y-3">
              {[
                'AI-Generated Study Plans',
                'Day-by-Day Curriculum',
                'LeetCode Practice Links',
                'Progress Tracking',
                'Revision Reminders',
              ].map((feature) => (
                <li key={feature} className="text-gray-400 text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#99d1ca] shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-700/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-medium">
            © {currentYear} <span className="text-gray-300 font-semibold">SmartRevision</span>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            Built with 
            <span className="text-red-400 animate-pulse">♥</span>
            using AI &amp; React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
