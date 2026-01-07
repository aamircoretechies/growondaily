import { useSettingEdit } from "@/pages/settings/Provider/SettingeEditProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";

const DeleteAccountPopUp = ({ onClose }: any) => {
  const { deleteAccount } = useSettingEdit();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
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

        toast.success(formatMessage({ id: "TOAST.ACCOUNT_DELETED" }));
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
          setErrorMessage(errorMessages || response.message || formatMessage({ id: "TOAST.ACCOUNT_DELETE_FAILED" }));
        } else {
          setErrorMessage(response.message || formatMessage({ id: "TOAST.ACCOUNT_DELETE_FAILED" }));
        }
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(formatMessage({ id: "TOAST.UNEXPECTED_ERROR" }));
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800">
          <FormattedMessage id="PROFILE.DELETE_ACCOUNT" />
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          <FormattedMessage id="ACCOUNT.DELETE_ACCOUNT_CONFIRMATION" />
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-transparent text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-gray-700 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <FormattedMessage id="BUTTONS.CANCEL" />
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <FormattedMessage id="BUTTONS.DELETING" />
            ) : (
              <FormattedMessage id="BUTTONS.DELETE" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPopUp;
