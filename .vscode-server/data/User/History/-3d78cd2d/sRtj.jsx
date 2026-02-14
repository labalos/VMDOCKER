const token = localStorage.getItem('token');
const res = await fetch('/api/protegida', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});
