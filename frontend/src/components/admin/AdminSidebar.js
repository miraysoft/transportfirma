import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LayoutDashboard, MessageSquare, LogOut, X, Shield } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mesajlar', href: '/admin/inquiries', icon: MessageSquare },
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div data-testid="admin-sidebar" className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white
        border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Ammann & Co</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden p-1" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isCurrent = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <button
                  key={item.name}
                  data-testid={`admin-nav-${item.name.toLowerCase()}`}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl font-medium transition-all duration-200
                    ${isCurrent
                      ? 'bg-red-50 text-red-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isCurrent ? 'text-red-600' : ''}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-red-600">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name || user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              data-testid="admin-sidebar-logout"
              variant="outline"
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Cikis Yap
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
