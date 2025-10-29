import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Play, PlaySquare, PlusSquare, Search, Settings, Video,  X } from "lucide-react";

function Nav() {
  const [showSearch, setShowSearch] = useState(true);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 lg:px-4 sm:px-2 py-2">
      <div className="flex items-center justify-between w-full gap-2 overflow-x-auto md:justify-between lg:justify-between">
         <div className="flex gap-2 items-center"><div className="bg-blue-600 text-white rounded-full border flex items-center justify-center 
                        w-10 h-10 sm:w-12 sm:h-12 text-3xl sm:text-4xl font-bold flex-shrink-0">
          B
          
        </div>
        <h1 className="text-blue-400 text-4xl md:hidden lg:flex hidden font-bold ">Blog App</h1>
        </div>

        
        <div className="flex items-center justify-center gap-5 lg:gap-14  flex-shrink min-w-0">
          <NavLink
            to="/home/page"
            className={({ isActive }) =>
              isActive
                ? "p-2 text-blue-600   border-b-3 border-b-blue-600   "
                : "p-2 hover:bg-gray-200 rounded"
            }
          >
           <Home className="sm:size-6 lg:size-8 md:size-8"/>
          </NavLink>

          <NavLink
            to="/home/video"
            className={({ isActive }) =>
              isActive
                ? "p-2 text-blue-600   border-b-3 border-b-blue-600   "
                : "p-2 hover:bg-gray-200 rounded"
            }
          >
            <PlaySquare  className="sm:size-6 lg:size-8 md:size-8" />
          </NavLink>

          <NavLink
            to="/home/createpost"
            className={({ isActive }) =>
              isActive
                ? "p-2 text-blue-600   border-b-3 border-b-blue-600   "
                : "p-2 hover:bg-gray-200 rounded"
            }
          >
           <PlusSquare className="sm:size-6 lg:size-8 md:size-8"/>
          </NavLink>

          <NavLink
            to="/home/setting"
            className={({ isActive }) =>
              isActive
                ? "p-2 text-blue-600   border-b-3 border-b-blue-600   "
                : "p-2 hover:bg-gray-200 rounded"
            }
          >
           <Settings className="sm:size-6 lg:size-8 md:size-8"/>
          </NavLink>
        </div>

        {/* 🔍 Search Section */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="rounded-full bg-gray-100 w-64 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-white transition"
            />
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition"
          >
            {showSearch ? <X size={26} /> : <Search size={26} />}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="sm:hidden px-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full mt-2 rounded-full bg-gray-100 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-white transition "
          />
        </div>
      )}
    </nav>
  );
}

export default Nav;
