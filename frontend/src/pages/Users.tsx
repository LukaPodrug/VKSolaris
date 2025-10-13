import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Drawer, List, ListItem, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
  const [selected, setSelected] = useState<User | null>(null);
  const [discount, setDiscount] = useState<number>(0);

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
  async function applyUserDiscount(id: number, pct: number) {
    await api.post(`/users/${id}/apply-promo`, { discountPercent: pct });
    load();
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Users</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id} hover onClick={() => { setSelected(u); setDiscount(0); }} style={{ cursor: 'pointer' }}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.first_name} {u.last_name}</TableCell>
                <TableCell>{u.member_id}</TableCell>
                <TableCell>{u.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        <Box sx={{ width: 360 }} role="presentation">
          {selected && (
            <>
              <List>
                <ListItem>
                  <ListItemText primary={`${selected.first_name} ${selected.last_name}`} secondary={`ID: ${selected.id} • Member: ${selected.member_id}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={selected.status} />
                </ListItem>
              </List>
              <Divider />
              <Box sx={{ p: 2, display: 'grid', gap: 1 }}>
                <Button variant="contained" onClick={() => approve(selected.id)} disabled={selected.status === 'active'}>Confirm</Button>
                <Button variant="outlined" color="warning" onClick={() => suspend(selected.id)} disabled={selected.status === 'suspended'}>Suspend</Button>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel id="discount-label">Discount</InputLabel>
                  <Select labelId="discount-label" value={discount} label="Discount" onChange={(e) => setDiscount(Number(e.target.value))}>
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={100}>100% (Free)</MenuItem>
                  </Select>
                </FormControl>
                <Button onClick={() => applyUserDiscount(selected.id, discount)} disabled={discount === 0}>Apply Discount</Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}


