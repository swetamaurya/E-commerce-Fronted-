// CustomDialog.jsx
import React from "react";

const variants = {
  danger: {
    confirm: "bg-red-500 hover:bg-red-600 text-white",
    cancel:  "bg-gray-200 hover:bg-gray-300 text-gray-700",
  },
  success: {
    confirm: "bg-green-500 hover:bg-green-600 text-white",
    cancel:  "bg-gray-200 hover:bg-gray-300 text-gray-700",
  },
  default: {
    confirm: "bg-teal-600 hover:bg-teal-700 text-white",
    cancel:  "bg-gray-200 hover:bg-gray-300 text-gray-700",
  },
};

export default function CustomDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  showCancel = true,
  variant = "default",   // "danger" | "success" | "default"
  splitButtons = false,  // screenshot-like 50/50 buttons
}) {
  if (!isOpen) return null;

  const v = variants[variant] || variants.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm overflow-hidden rounded-md bg-white shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="px-5 py-6 text-center text-gray-700">
          <p>{message}</p>
        </div>

        {/* footer */}
        {splitButtons ? (
          <div className="flex">
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 text-sm font-semibold ${v.confirm}`}
            >
              {confirmText}
            </button>
            {showCancel && (
              <button
                onClick={onClose}
                className={`flex-1 py-3 text-sm font-semibold ${v.cancel}`}
              >
                {cancelText}
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-end gap-3 px-4 pb-4">
            {showCancel && (
              <button
                onClick={onClose}
                className={`rounded-md px-4 py-2 text-sm font-semibold ${v.cancel}`}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${v.confirm}`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
