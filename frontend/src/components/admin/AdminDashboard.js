import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, CheckCircle, Eye, Clock, TrendingUp,
  ArrowRight, Inbox
} from 'lucide-react';
import { Button } from '../ui/button';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const statusLabels = { new: 'Yeni', reviewed: 'Incelendi', contacted: 'Iletisime Gecildi' };
const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-amber-100 text-amber-700',
  contacted: 'bg-green-100 text-green-700'
};

const AdminDashboard = () => {
  const { apiCall } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await apiCall('GET', '/admin/dashboard');
      if (result.success) setStats(result.data);
      setLoading(false);
    };
    fetchStats();
  }, [apiCall]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">Veriler yuklenemedi. Tekrar deneyin.</div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Genel bakis ve istatistikler</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Mesaj"
          value={stats.total_inquiries}
          icon={MessageSquare}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Yeni Mesajlar"
          value={stats.new_inquiries}
          icon={Inbox}
          color="bg-red-50 text-red-600"
          subtitle="Bekleyen"
        />
        <StatCard
          title="Incelenen"
          value={stats.reviewed_inquiries}
          icon={Eye}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Iletisime Gecildi"
          value={stats.contacted_inquiries}
          icon={CheckCircle}
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inquiries_today}</p>
              <p className="text-sm text-gray-500">Bugun</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inquiries_this_week}</p>
              <p className="text-sm text-gray-500">Bu Hafta</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inquiries_this_month}</p>
              <p className="text-sm text-gray-500">Bu Ay</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">Son Mesajlar</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/inquiries')}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="view-all-inquiries-btn"
              >
                Tumunu Gor <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.recent_inquiries.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Henuz mesaj yok</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{inquiry.name}</p>
                      <p className="text-xs text-gray-500 truncate">{inquiry.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[inquiry.status] || inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900">Populer Hizmetler</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.popular_services.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Henuz veri yok</p>
            ) : (
              <div className="space-y-3">
                {stats.popular_services.map((svc, idx) => {
                  const maxCount = stats.popular_services[0]?.count || 1;
                  const pct = Math.round((svc.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{svc.service}</span>
                        <span className="text-sm font-bold text-gray-900">{svc.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
