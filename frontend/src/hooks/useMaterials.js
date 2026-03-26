import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { getSocket } from "../services/socketService";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const useMaterials = (groupId) => {
  const [materials, setMaterials] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchMaterials = useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await axios.get(`${BACKEND}/groups/${groupId}/materials`, {
        withCredentials: true
      });
      setMaterials(res.data);
    } catch (err) {
      console.error("Fetch materials error:", err);
    }
  }, [groupId]);

  const uploadMaterial = useCallback(async (file, messageId) => {
    if (!groupId) return;
    const formData = new FormData();
    formData.append("file", file);
    if (messageId) {
      formData.append("messageId", messageId);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await axios.post(
        `${BACKEND}/groups/${groupId}/upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        }
      );

      setMaterials((prev) => {
        if (prev.some(m => m._id === res.data._id)) return prev;
        return [res.data, ...prev];
      });
      enqueueSnackbar("Material uploaded", { variant: "success" });
      return true;
    } catch (err) {
      console.error("Upload error:", err);
      enqueueSnackbar(err.response?.data?.message || "Upload failed", { variant: "error" });
      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMaterials();

    const socket = getSocket();
    const handleMaterialUploaded = (material) => {
      setMaterials((prev) => {
        if (prev.some(m => m._id === material._id)) return prev;
        return [material, ...prev];
      });
    };

    socket.on("materialUploaded", handleMaterialUploaded);

    return () => {
      socket.off("materialUploaded", handleMaterialUploaded);
    };
  }, [groupId, fetchMaterials]);

  return {
    materials,
    uploading,
    uploadProgress,
    uploadMaterial,
    refreshMaterials: fetchMaterials
  };
};
