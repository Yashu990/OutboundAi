import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { statsData as mockStats } from '../data/mockData';
import { TrendingUp, Users, Briefcase, Activity, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Deals', value: stats?.activeDeals || 0, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: stats?.conversionRate || '0%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-brand" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{activity.lead_name || 'System'}</span>: {activity.note || activity.type}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                mockStats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{activity.user}</span> {activity.action} {' '}
                        <span className="font-semibold text-brand">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Prospect / New</span>
                <Badge variant="info">{stats?.pipeline?.prospect || 0}</Badge>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(stats?.pipeline?.prospect || 0) > 0 ? (stats.pipeline.prospect / 50 * 100) : 0}%` }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contacted</span>
                <Badge variant="warning">{stats?.pipeline?.contacted || 0}</Badge>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: `${(stats?.pipeline?.contacted || 0) > 0 ? (stats.pipeline.contacted / 50 * 100) : 0}%` }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Won / Closed</span>
                <Badge variant="success">{stats?.pipeline?.closed || 0}</Badge>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${(stats?.pipeline?.closed || 0) > 0 ? (stats.pipeline.closed / 50 * 100) : 0}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
