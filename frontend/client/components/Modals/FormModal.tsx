import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText?: string;
  isLoading?: boolean;
}

export default function FormModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Confirm',
  isLoading = false,
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-libsmart-slate/20">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-libsmart-slate/10 rounded transition-colors"
          >
            <X size={20} className="text-libsmart-slate" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-libsmart-slate/20 text-libsmart-slate hover:bg-libsmart-slate/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-libsmart-blue hover:bg-libsmart-blue/90 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
