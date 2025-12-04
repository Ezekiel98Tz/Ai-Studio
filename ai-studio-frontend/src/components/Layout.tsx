import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-white dark:bg-background">
      {children}
    </div>
  );
};

export default Layout;
