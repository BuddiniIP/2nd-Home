export const loginUser = async ({ username, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'student') return resolve({ role: 'student' });
      if (username === 'owner') return resolve({ role: 'owner' });
      if (username === 'admin') return resolve({ role: 'admin' });
      return reject(new Error('Invalid credentials'));
    }, 400);
  });
}