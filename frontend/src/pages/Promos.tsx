import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';

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
    <div>
      <h2>Promos</h2>
      <form onSubmit={create} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} />
        <input type="number" placeholder="Discount %" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        <button type="submit">Create</button>
      </form>
      <table cellPadding={6}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map(p => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.discount_percent}%</td>
              <td>{p.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => toggleActive(p)}>{p.is_active ? 'Disable' : 'Enable'}</button>{' '}
                <button onClick={() => remove(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


