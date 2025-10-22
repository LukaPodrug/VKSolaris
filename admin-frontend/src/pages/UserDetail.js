import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { adminAPI } from '../services/api';

const StatusChip = ({ status }) => {
  const statusConfig = {
    confirmed: { color: 'success', label: 'Confirmed' },
    pending: { color: 'warning', label: 'Pending' },
    suspended: { color: 'error', label: 'Suspended' },
  };

  const config = statusConfig[status] || { color: 'default', label: status };
  return <Chip label={config.label} color={config.color} />;
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const { data, isLoading, error } = useQuery(
    ['user', id],
    () => adminAPI.getUser(id),
    {
      enabled: !!id,
    }
  );

  const updateStatusMutation = useMutation(
    (status) => adminAPI.updateUserStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', id]);
        queryClient.invalidateQueries('users');
        setStatusDialogOpen(false);
      },
    }
  );

  const updateDiscountMutation = useMutation(
    (discountPercentage) => adminAPI.updateUserDiscount(id, parseInt(discountPercentage)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', id]);
        queryClient.invalidateQueries('users');
        setDiscountDialogOpen(false);
      },
    }
  );

  const handleStatusUpdate = () => {
    if (newStatus) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  const handleDiscountUpdate = () => {
    if (newDiscount !== '') {
      updateDiscountMutation.mutate(newDiscount);
    }
  };

  const openStatusDialog = () => {
    setNewStatus(user?.status || '');
    setStatusDialogOpen(true);
  };

  const openDiscountDialog = () => {
    setNewDiscount(user?.discountPercentage?.toString() || '0');
    setDiscountDialogOpen(true);
  };

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
        Failed to load user details: {error.message}
      </Alert>
    );
  }

  const user = data?.data?.user;

  if (!user) {
    return (
      <Alert severity="error">
        User not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/users')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          User Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Username
              </Typography>
              <Typography variant="body1">
                {user.username}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user.email || 'Not provided'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Registration Date
              </Typography>
              <Typography variant="body1">
                {format(new Date(user.createdAt), 'PPP')}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                {format(new Date(user.updatedAt), 'PPP')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Account Status & Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Status & Settings
            </Typography>
            
            <Box mb={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Status
                </Typography>
                <Tooltip title="Update Status">
                  <IconButton size="small" onClick={openStatusDialog}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <StatusChip status={user.status} />
            </Box>

            <Box mb={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Discount Percentage
                </Typography>
                <Tooltip title="Update Discount">
                  <IconButton size="small" onClick={openDiscountDialog}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h6">
                {user.discountPercentage || 0}%
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Season Ticket
              </Typography>
              <Chip
                label={user.hasSeasonTicket ? 'Active' : 'None'}
                color={user.hasSeasonTicket ? 'success' : 'default'}
              />
              {user.seasonTicketYear && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Year: {user.seasonTicketYear}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Season Tickets History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Season Tickets History
            </Typography>
            
            {user.seasonTickets && user.seasonTickets.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Season Year</TableCell>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Amount Paid</TableCell>
                      <TableCell>Ticket Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.seasonTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.seasonYear}</TableCell>
                        <TableCell>
                          {format(new Date(ticket.purchaseDate), 'PPP')}
                        </TableCell>
                        <TableCell>${ticket.amountPaid}</TableCell>
                        <TableCell>{ticket.ticketType}</TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.isActive ? 'Active' : 'Inactive'}
                            color={ticket.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary">
                No season tickets purchased yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update User Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updateStatusMutation.isLoading || !newStatus}
          >
            {updateStatusMutation.isLoading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discount Update Dialog */}
      <Dialog open={discountDialogOpen} onClose={() => setDiscountDialogOpen(false)}>
        <DialogTitle>Update Discount Percentage</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Discount Percentage"
            type="number"
            fullWidth
            variant="outlined"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
            helperText="Enter a value between 0 and 100"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiscountDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDiscountUpdate}
            variant="contained"
            disabled={updateDiscountMutation.isLoading || newDiscount === ''}
          >
            {updateDiscountMutation.isLoading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Messages */}
      {updateStatusMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to update status: {updateStatusMutation.error.message}
        </Alert>
      )}

      {updateDiscountMutation.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to update discount: {updateDiscountMutation.error.message}
        </Alert>
      )}
    </Box>
  );
};

export default UserDetail;