import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  isLoading = false,
  isDangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Icon and Content */}
        <div className="p-6 text-center space-y-4">
          {isDangerous && (
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-black mb-2">{title}</h2>
            <p className="text-sm text-libsmart-slate">{message}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-libsmart-slate/20 text-libsmart-slate hover:bg-libsmart-slate/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-libsmart-blue hover:bg-libsmart-blue/90'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
