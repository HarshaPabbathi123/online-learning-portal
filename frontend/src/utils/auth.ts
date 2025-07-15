export const getUserFromToken = (): { id: string; role: string } | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, role: payload.role };
  } catch (err) {
    return null;
  }
};

export const clearToken = () => {
  localStorage.removeItem('token');
};
