// components/Toast.jsx
import { toast } from 'react-hot-toast';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';

const iconMap = {
  success: <FaCheckCircle className="w-6 h-6 text-green-500" />,
  error: <FaTimesCircle className="w-6 h-6 text-red-500" />,
  warning: <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />,
  info: <FaInfoCircle className="w-6 h-6 text-blue-500" />,
};

const bgColorMap = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  warning: 'bg-yellow-50',
  info: 'bg-blue-50',
};

const Toast = {
  show: ({ message, type = 'info' }) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full ${bgColorMap[type]} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
      >
        <div className="flex-shrink-0">{iconMap[type]}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
      </div>
    ));
  },
};

export default Toast;
