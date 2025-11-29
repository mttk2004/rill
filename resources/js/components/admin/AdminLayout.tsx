import React from 'react';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <AdminHeader />
      <main>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
