import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  ...props
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`bg-white rounded-3xl border border-slate-200/60 shadow-2xl relative w-full max-w-lg z-10 overflow-hidden text-left flex flex-col ${className}`}
            {...props}
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {/* Body content */}
            <div className="overflow-y-auto max-h-[75vh] p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const slideVariants = {
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
      exit: { x: '-100%' },
    },
  };

  const borderClasses = position === 'right' ? 'border-l rounded-l-3xl' : 'border-r rounded-r-3xl';
  const positionClasses = position === 'right' ? 'right-0 top-0 bottom-0' : 'left-0 top-0 bottom-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants[position]}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 35 }}
            className={`fixed ${positionClasses} w-80 max-w-[85vw] bg-white border-slate-200/60 shadow-2xl flex flex-col z-10 ${borderClasses} ${className}`}
            {...props}
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
