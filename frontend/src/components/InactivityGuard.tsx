import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;

const InactivityGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const updateActivity = () => { lastActivity.current = Date.now(); };

    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('mousedown', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('touchstart', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });
    window.addEventListener('focus', updateActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity.current > INACTIVITY_LIMIT) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('profilePicture');
        navigate('/login', { replace: true });
      }
    }, CHECK_INTERVAL);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('focus', updateActivity);
      clearInterval(interval);
    };
  }, [navigate]);

  return <>{children}</>;
};

export default InactivityGuard;
