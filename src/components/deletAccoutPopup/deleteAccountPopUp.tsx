import { useSettingEdit } from "@/pages/settings/Provider/SettingeEditProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DeleteAccountPopUp = ({ onClose }: any) => {
  const { deleteAccount } = useSettingEdit();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
  setLoading(true);
  const response = await deleteAccount();

  if (response?.success) {
    // Clear storage safely
    localStorage.clear();
    sessionStorage.clear();

    // Close popup
    onClose();

    // IMPORTANT: add small delay to avoid conflict with modal closing transition
    setTimeout(() => {
      navigate("/signup", { replace: true });
      window.location.reload(); // ensures user logged out fully
    }, 300);
  }

  setLoading(false);
};


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800">Delete Account</h2>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

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
