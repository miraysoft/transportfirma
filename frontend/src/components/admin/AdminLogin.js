import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, User, LogIn, Shield } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAdmin();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(credentials);
    
    if (!result.success) {
      // Error is handled by the context with toast
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 p-4 bg-red-100 rounded-2xl">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold font-display text-gray-900 mb-2">
            Admin Panel
          </CardTitle>
          <p className="text-gray-600 font-medium">
            Ammann & Co Transport
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Benutzername
              </label>
              <Input
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="admin"
                required
                className="h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Passwort
              </label>
              <Input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                className="h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-xl text-lg"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Anmeldung...
                </>
              ) : (
                <>
                  <LogIn className="mr-3 h-5 w-5" />
                  Anmelden
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <strong>Standard-Anmeldedaten:</strong><br />
              Benutzername: <code className="bg-gray-200 px-1 rounded">admin</code><br />
              Passwort: <code className="bg-gray-200 px-1 rounded">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;