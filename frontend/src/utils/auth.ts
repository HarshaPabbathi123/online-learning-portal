// ✅ src/utils/auth.ts
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      role: payload.role,
      name: payload.name, // ✅ Add this line (you must include name in token when generating)
    };
  } catch (err) {
    return null;
  }
};
