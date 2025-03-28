import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    youOwe: 0,
    youAreOwed: 0,
    recentActivities: [],
    groups: []
  });

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8080/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Balance</h3>
          <p className={`text-2xl font-bold ${
            dashboardData.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(dashboardData.totalBalance)}
          </p>
        </div>
        <div className="card bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">You Owe</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(dashboardData.youOwe)}
          </p>
        </div>
        <div className="card bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">You are Owed</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(dashboardData.youAreOwed)}
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
          <Link to="/activities" className="text-emerald-600 hover:text-emerald-700">
            View All
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {dashboardData.recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-medium ${
                      activity.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(activity.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Groups */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
          <Link to="/groups" className="text-emerald-600 hover:text-emerald-700">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.groups.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-4">
              No groups yet. Create one to get started!
            </p>
          ) : (
            dashboardData.groups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {group.memberCount} members
                </p>
                {group.balance !== 0 && (
                  <p className={`text-sm font-medium ${
                    group.balance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(group.balance)}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 