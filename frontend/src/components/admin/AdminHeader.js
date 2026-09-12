import React from 'react';
import { Button } from '../ui/button';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const AdminHeader = ({ setSidebarOpen }) => {
  const { user, logout } = useAdmin();

  return (
    <header data-testid="admin-header" className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
            data-testid="admin-sidebar-toggle"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Hosgeldiniz, {user?.full_name || user?.username || 'Admin'}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-semibold">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.username}</span>
          </div>
          <Button
            data-testid="admin-logout-btn"
            variant="ghost"
            size="sm"
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
