import { fetchWithAuth } from '../helpers/fetchWithAuth';

async function cargarProtegida() {
  const res = await fetchWithAuth('/protegida', { method: 'GET' });
}
