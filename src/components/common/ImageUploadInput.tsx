"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Loader2, CheckCircle2 } from "lucide-react";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = "Food Image",
}: ImageUploadInputProps) {
  const [tab, setTab] = useState<"file" | "url">("file");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image.");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab("file")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
              tab === "file" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload size={14} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
              tab === "url" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LinkIcon size={14} /> Paste URL
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Image Preview if available */}
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-900">
            <img src={value} alt="Uploaded Food Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
              title="Remove image"
            >
              <X size={16} />
            </button>
            <span className="absolute left-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
              <CheckCircle2 size={13} /> Image Attached
            </span>
          </div>
        </div>
      ) : tab === "file" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="py-3">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-slate-700">Processing image upload...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:scale-110">
                <ImageIcon size={24} />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to browse or upload image from computer / mobile
              </p>
              <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 font-medium"
          />
        </div>
      )}
    </div>
  );
}
