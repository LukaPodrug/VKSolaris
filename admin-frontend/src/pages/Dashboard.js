import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon,
  LocalActivity as TicketIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminAPI } from '../services/api';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery(
    'dashboardStats',
    () => adminAPI.getDashboardStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load dashboard data: {error.message}
      </Alert>
    );
  }

  const statsData = stats?.data;

  // Prepare chart data
  const userStatusData = [
    { name: 'Confirmed', value: statsData?.usersByStatus?.confirmed || 0, color: '#4caf50' },
    { name: 'Pending', value: statsData?.usersByStatus?.pending || 0, color: '#ff9800' },
    { name: 'Suspended', value: statsData?.usersByStatus?.suspended || 0, color: '#f44336' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={statsData?.totalUsers || 0}
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Season Tickets Sold"
            value={statsData?.seasonTicketsSold || 0}
            icon={<TicketIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue (This Year)"
            value={`$${statsData?.revenue?.toFixed(2) || '0.00'}`}
            icon={<MoneyIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Registrations (30d)"
            value={statsData?.recentRegistrations || 0}
            icon={<ScheduleIcon fontSize="large" />}
            color="info"
          />
        </Grid>

        {/* User Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Status Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography>
                  Confirmed: {statsData?.usersByStatus?.confirmed || 0}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <ScheduleIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography>
                  Pending: {statsData?.usersByStatus?.pending || 0}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <BlockIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography>
                  Suspended: {statsData?.usersByStatus?.suspended || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Conversion Rate
                </Typography>
                <Typography variant="h6">
                  {statsData?.totalUsers > 0
                    ? ((statsData?.seasonTicketsSold / statsData?.totalUsers) * 100).toFixed(1)
                    : 0}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Avg. Ticket Price
                </Typography>
                <Typography variant="h6">
                  ${statsData?.seasonTicketsSold > 0
                    ? (statsData?.revenue / statsData?.seasonTicketsSold).toFixed(2)
                    : '0.00'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Pending Approval
                </Typography>
                <Typography variant="h6">
                  {statsData?.usersByStatus?.pending || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Active Users
                </Typography>
                <Typography variant="h6">
                  {(statsData?.usersByStatus?.confirmed || 0) + (statsData?.usersByStatus?.pending || 0)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;