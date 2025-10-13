import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

type Promo = {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
};

export function Promos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<number>(0);

  async function load() {
    const { data } = await api.get('/promos');
    setPromos(data);
  }

  useEffect(() => { load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api.post('/promos', { code, discountPercent: discount });
    setCode('');
    setDiscount(0);
    load();
  }

  async function toggleActive(p: Promo) {
    await api.patch(`/promos/${p.id}`, { isActive: !p.is_active });
    load();
  }

  async function remove(id: number) {
    await api.delete(`/promos/${id}`);
    load();
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Promos</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box component="form" onSubmit={create} sx={{ display: 'flex', gap: 1 }}>
          <TextField label="CODE" value={code} onChange={(e) => setCode(e.target.value)} />
          <TextField type="number" label="Discount %" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          <Button type="submit" variant="contained">Create</Button>
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promos.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.code}</TableCell>
                <TableCell>{p.discount_percent}%</TableCell>
                <TableCell>{p.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => toggleActive(p)}>{p.is_active ? 'Disable' : 'Enable'}</Button>
                  <Button size="small" color="error" onClick={() => remove(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


