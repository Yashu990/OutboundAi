import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const [searchValue, setSearchValue] = React.useState('');
  
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search leads, deals, tasks..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm transition-all"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">Alex Rivera</p>
            <p className="text-xs text-gray-500">Sales Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center text-white font-bold">
            AR
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
