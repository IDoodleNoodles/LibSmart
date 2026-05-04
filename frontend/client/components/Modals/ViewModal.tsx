import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ViewModal({
  isOpen,
  title,
  onClose,
  children,
}: ViewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-libsmart-slate/20 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-libsmart-slate/10 rounded transition-colors"
          >
            <X size={20} className="text-libsmart-slate" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-libsmart-slate/20 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-libsmart-blue hover:bg-libsmart-blue/90"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
