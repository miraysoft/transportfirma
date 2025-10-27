import React from 'react';
import { Button } from '../ui/button';
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Input } from '../ui/input';

const AdminHeader = ({ setSidebarOpen }) => {
  const { user, darkMode, toggleDarkMode } = useAdmin();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
              Willkommen zurück, {user?.full_name || user?.username}!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Suchen..."
              className="pl-10 w-64 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </Button>

          {/* User avatar */}
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;