import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  member_id: string;
  status: string;
};

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [memberId, setMemberId] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (_e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: number) {
    await api.post(`/users/${id}/approve`);
    load();
  }
  async function suspend(id: number) {
    await api.post(`/users/${id}/suspend`);
    load();
  }
  async function applyPromo(id: number, discountPercent: number) {
    await api.post(`/users/${id}/apply-promo`, { discountPercent });
    load();
  }
  async function issueWallet(id: number, u: User) {
    await api.post(`/wallet/issue/${id}`, { firstName: u.first_name, lastName: u.last_name, memberId: u.member_id });
    load();
  }
  async function createUser() {
    await api.post('/users', { firstName, lastName, memberId });
    setFirstName('');
    setLastName('');
    setMemberId('');
    load();
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Users</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField label="Member ID" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
          <Button variant="contained" onClick={createUser}>Create</Button>
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.first_name} {u.last_name}</TableCell>
                <TableCell>{u.member_id}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => approve(u.id)}>Approve</Button>
                  <Button size="small" onClick={() => suspend(u.id)}>Suspend</Button>
                  <Button size="small" onClick={() => applyPromo(u.id, 100)}>Youth Free</Button>
                  <Button size="small" onClick={() => applyPromo(u.id, 50)}>50% Off</Button>
                  <Button size="small" onClick={() => issueWallet(u.id, u)}>Issue Wallet</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


