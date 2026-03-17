import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut } from 'lucide-react';
import logo from '../../logoo.png';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Deals', icon: Briefcase, path: '/deals' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm z-20">
      {/* Brand Section */}
      <div className="p-6 flex items-center justify-center border-b border-gray-50">
        <img src={logo} alt="Sales Automator" className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? 'bg-brand/10 text-brand font-semibold shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-brand' : ''}`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Workspace Footer */}
      <div className="p-4 border-t border-gray-50 space-y-2">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50 text-sm font-medium"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-600 transition-all rounded-xl hover:bg-red-50 text-sm font-bold group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
