import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === "admin") navigate("/admin-dashboard");
    else if (user?.role === "employee") navigate("/employee-dashboard");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1B3668] mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={handleBack}
          className="px-5 py-2 bg-[#1B3668] hover:bg-[#0f2040] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
