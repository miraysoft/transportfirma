import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  X,
  Shield
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Anfragen',
      href: '/admin/inquiries',
      icon: MessageSquare,
      current: location.pathname === '/admin/inquiries'
    },
    {
      name: 'Benutzer',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Einstellungen',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ammann & Co Transport
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl font-medium transition-all duration-200
                    ${item.current 
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${item.current ? 'text-red-600 dark:text-red-400' : ''}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.full_name || user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;