import React, { useEffect } from "react";

type SharePopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  textToShare: string;
};

const SharePopUp = ({ isOpen, onClose, textToShare }: SharePopUpProps) => {
  if (!isOpen) return null;

  const encoded = encodeURIComponent(textToShare);
  const hasContent = textToShare && textToShare !== "No content available to share.";

  // Close popup on clicking outside
  const handleOutsideClick = (e: any) => {
    if (e.target.id === "sharePopupOverlay") {
      onClose();
    }
  };

  return (
    <div
      id="sharePopupOverlay"
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999]"
    >
      <div className="bg-white/90 dark:bg-gray-100 rounded-xl shadow-lg border border-gray-200 w-80 p-4 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-primary">Share</h2>

          {/* Close Icon */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-primary transition"
          >
            ✕
          </button>
        </div>

        {/* Content Preview or Message */}
        {hasContent ? (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg max-h-32 overflow-y-auto text-sm text-gray-700">
            {textToShare}
          </div>
        ) : (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-500 italic text-center">
            {textToShare || "No content available to share."}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">

          {/* WhatsApp */}
          <a
            href={hasContent ? `https://wa.me/?text=${encoded}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={!hasContent ? (e) => e.preventDefault() : undefined}
            className={`w-full block text-center py-2 rounded-lg font-medium transition ${
              hasContent
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Share on WhatsApp
          </a>

          {/* Facebook */}
          <a
            href={hasContent ? `https://www.facebook.com/sharer/sharer.php?u=${encoded}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={!hasContent ? (e) => e.preventDefault() : undefined}
            className={`w-full block text-center py-2 rounded-lg font-medium transition ${
              hasContent
                ? 'bg-sand text-primary hover:bg-sand/80'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Share on Facebook
          </a>

          {/* Copy */}
          <button
            onClick={() => {
              if (hasContent) {
                navigator.clipboard.writeText(textToShare);
                alert("Copied!");
              }
            }}
            disabled={!hasContent}
            className={`w-full py-2 rounded-lg font-medium transition ${
              hasContent
                ? 'bg-gray-200 text-primary hover:bg-gray-300'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Copy Text
          </button>

        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-center py-2 rounded-lg bg-gray-100 text-primary font-medium hover:bg-gray-200 transition"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default SharePopUp;
