import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminInquiries from '../components/admin/AdminInquiries';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { AdminProvider, useAdmin } from '../contexts/AdminContext';

const AdminLayout = ({ children }) => {
  const { user } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/inquiries" element={<AdminInquiries />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const AdminPage = () => {
  return (
    <AdminProvider>
      <Router basename="/admin">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminRoutes />
        </div>
      </Router>
    </AdminProvider>
  );
};

export default AdminPage;