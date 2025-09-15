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
  green: {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-md bg-white shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between border-b px-3 sm:px-4 py-2 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="px-4 sm:px-5 py-4 sm:py-6 text-center text-gray-700">
          <p className="text-sm sm:text-base leading-relaxed">{message}</p>
        </div>

        {/* footer */}
        {splitButtons ? (
          <div className="flex">
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-2 text-xs sm:text-sm font-semibold ${v.confirm}`}
            >
              {confirmText}
            </button>
            {showCancel && (
              <button
                onClick={onClose}
                className={`flex-1 py-3 px-2 text-xs sm:text-sm font-semibold ${v.cancel}`}
              >
                {cancelText}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4">
            {showCancel && (
              <button
                onClick={onClose}
                className={`w-full sm:w-auto rounded-md px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold ${v.cancel}`}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`w-full sm:w-auto rounded-md px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold ${v.confirm}`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
