import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9fafb]" data-component="app">
      {/* Sidebar Wrapper */}
      <div 
        className={`transition-all duration-300 relative ${sidebarOpen ? 'w-[180px]' : 'w-[0px]'}`} 
      >
         <div className={`absolute left-0 top-0 bottom-0 w-[180px] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <Sidebar />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto mt-[80px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

