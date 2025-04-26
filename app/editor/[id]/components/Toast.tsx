"use client"

import { useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50 border border-gray-700">
      <CheckCircle className="h-4 w-4 text-emerald-500" />
      <span className="text-sm">{message}</span>
    </div>
  );
}