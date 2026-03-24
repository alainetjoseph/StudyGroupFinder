import React, { useState } from "react";
import axios from "axios";
import { Flag } from "lucide-react";
import { enqueueSnackbar } from "notistack";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function ReportModal({ open, setOpen, targetId, targetType }) {

  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitReport = async () => {

    if (!reason) {
      enqueueSnackbar("Please select a reason", { variant: "warning" });
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("targetType", targetType);
      formData.append("targetId", targetId);
      formData.append("reason", reason);
      formData.append("description", description);

      images.forEach((img) => {
        formData.append("evidence", img);
      });

      await axios.post(
        `${BACKEND}/reports`,
        formData,
        { withCredentials: true }
      );

      enqueueSnackbar("Report submitted", { variant: "success" });

      setOpen(false);

    } catch (err) {

      enqueueSnackbar("Failed to submit report", { variant: "error" });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 text-foreground">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Flag className="text-destructive" size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            Report {targetType?.charAt(0).toUpperCase() + targetType?.slice(1)}
          </h2>
        </div>

        {/* Reason */}
        <label className="text-sm text-muted">
          Reason
        </label>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full mt-2 mb-4 bg-background border border-border text-foreground rounded-xl px-3 py-2 focus:outline-none focus:border-primary"
        >
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
          <option value="inappropriate">Inappropriate</option>
          <option value="fake">Fake / Scam</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <label className="text-sm text-muted">
          Additional details (optional)
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          placeholder="Explain what is wrong with this group..."
          className="w-full mt-2 bg-background border border-border text-foreground rounded-xl px-3 py-2 focus:outline-none focus:border-primary resize-none"
        />

        <label className="text-sm text-muted">
          Attach evidence (optional)
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="mt-2 text-sm"
        />
        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm bg-card hover:bg-background rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={submitReport}
            disabled={loading}
            className="px-4 py-2 text-sm bg-destructive hover:bg-destructive/80 rounded-xl transition font-medium text-foreground"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>

        </div>

      </div>

    </div>
  );
}
