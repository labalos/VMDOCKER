import { fetchWithAuth } from '../helpers/fetchWithAuth';

async function cargarProtegida() {
  try {
    const res = await fetchWithAuth('/protegida', { method: 'GET' });
  } catch (e) {
  }
}
