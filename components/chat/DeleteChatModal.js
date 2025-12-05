"use client";
import { FiX } from "react-icons/fi";

export default function DeleteChatModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm border border-gray-200 animate-fadeIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 text-red-600 rounded-full p-2">
            <FiX size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete Chat?</h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow"
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
