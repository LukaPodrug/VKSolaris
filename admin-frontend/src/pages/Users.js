import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { adminAPI } from '../services/api';

const CustomToolbar = ({ onRefresh }) => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarExport />
    <Button
      startIcon={<RefreshIcon />}
      onClick={onRefresh}
      size="small"
    >
      Refresh
    </Button>
  </GridToolbarContainer>
);

const StatusChip = ({ status }) => {
  const statusConfig = {
    confirmed: { color: 'success', label: 'Confirmed' },
    pending: { color: 'warning', label: 'Pending' },
    suspended: { color: 'error', label: 'Suspended' },
  };

  const config = statusConfig[status] || { color: 'default', label: status };

  return <Chip label={config.label} color={config.color} size="small" />;
};

const Users = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    hasSeasonTicket: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery(
    ['users', page, pageSize, appliedFilters],
    () => adminAPI.getUsers({
      page: page + 1,
      limit: pageSize,
      ...appliedFilters,
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', hasSeasonTicket: '' });
    setAppliedFilters({});
    setPage(0);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 130,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'hasSeasonTicket',
      headerName: 'Season Ticket',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'discountPercentage',
      headerName: 'Discount %',
      width: 100,
      renderCell: (params) => `${params.value || 0}%`,
    },
    {
      field: 'createdAt',
      headerName: 'Registered',
      width: 120,
      renderCell: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => navigate(`/users/${params.row.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (error) {
    return (
      <Alert severity="error">
        Failed to load users: {error.message}
      </Alert>
    );
  }

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Name, username, or email"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Season Ticket</InputLabel>
            <Select
              value={filters.hasSeasonTicket}
              label="Season Ticket"
              onChange={(e) => handleFilterChange('hasSeasonTicket', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Has Ticket</MenuItem>
              <MenuItem value="false">No Ticket</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={applyFilters}
            startIcon={<SearchIcon />}
          >
            Apply Filters
          </Button>
          
          <Button
            variant="outlined"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[10, 25, 50]}
          page={page}
          onPageChange={setPage}
          rowCount={pagination.total || 0}
          paginationMode="server"
          loading={isLoading}
          components={{
            Toolbar: () => <CustomToolbar onRefresh={refetch} />,
            LoadingOverlay: () => (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ),
          }}
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
          onRowClick={(params) => navigate(`/users/${params.id}`)}
        />
      </Paper>

      {/* Summary */}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="textSecondary">
          Showing {users.length} of {pagination.total || 0} users
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Page {(pagination.page || 1)} of {pagination.totalPages || 1}
        </Typography>
      </Box>
    </Box>
  );
};

export default Users;