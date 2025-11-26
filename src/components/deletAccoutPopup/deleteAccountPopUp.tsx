import { useSettingEdit } from "@/pages/settings/Provider/SettingeEditProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DeleteAccountPopUp = ({ onClose }: any) => {
  const { deleteAccount } = useSettingEdit();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await deleteAccount();

      if (response?.success) {
        // Clear storage safely
        localStorage.clear();
        sessionStorage.clear();

        // Close popup
        onClose();

        // Redirect to signup page immediately
        navigate("/auth/signup", { replace: true });
      } else {
        // Log validation errors for debugging
        if (response?.errors && response.errors.length > 0) {
          console.error("Validation errors:", response.errors);
          const errorMessages = response.errors.map((err: any) => 
            err.msg || err.message || JSON.stringify(err)
          ).join(", ");
          setErrorMessage(errorMessages || response.message || "Failed to delete account");
        } else {
          setErrorMessage(response.message || "Failed to delete account");
        }
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800">Delete Account</h2>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPopUp;
