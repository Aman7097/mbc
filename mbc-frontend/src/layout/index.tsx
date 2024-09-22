import React from "react";
import Sidebar from "./sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-main-gradient w-full flex flex-row gap-4 h-screen p-8">
      <Sidebar />
      <div className="flex-grow-1 w-full">{children}</div>
    </div>
  );
};

export default Layout;
