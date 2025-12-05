import toast from 'react-hot-toast';

// Custom confirm dialog using toast with buttons
export const confirmToast = (message, onConfirm, onCancel = () => {}) => {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Confirm Action</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
                    onClick={() => {
                      toast.dismiss(toastId);
                      onConfirm();
                      resolve(true);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-2 px-3 rounded-md transition-colors"
                    onClick={() => {
                      toast.dismiss(toastId);
                      onCancel();
                      resolve(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(toastId);
                onCancel();
                resolve(false);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  });
};

// Enhanced toast notifications with custom styling
export const successToast = (message) => {
  toast.success(message, {
    style: {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
    iconTheme: {
      primary: '#22c55e',
      secondary: '#f0fdf4',
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    style: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fef2f2',
    },
  });
};

export const loadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: '#fef3c7',
      color: '#d97706',
      border: '1px solid #fde68a',
    },
    iconTheme: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
    },
  });
};

export const infoToast = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
    },
  });
};

export const warningToast = (message) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#fefce8',
      color: '#ca8a04',
      border: '1px solid #fef08a',
    },
  });
};