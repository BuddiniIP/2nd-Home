import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="fixed bottom-8 right-8 z-[300] max-w-sm"
        >
          <div className={`flex items-start gap-4 p-5 rounded-2xl shadow-2xl border ${
            type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {type === 'success' ? <CheckCircle2 size={22} className="shrink-0 mt-0.5" /> :
             type === 'error' ? <AlertCircle size={22} className="shrink-0 mt-0.5" /> :
             <AlertCircle size={22} className="shrink-0 mt-0.5" />}
            <p className="text-sm font-bold flex-1">{message}</p>
            <button onClick={onClose} className="shrink-0 hover:opacity-60 transition-opacity">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
