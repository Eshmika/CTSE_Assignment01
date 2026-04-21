"use client";

import { useEffect } from "react";

type CreativeToastProps = {
  open: boolean;
  title: string;
  message: string;
  tone?: "success" | "info" | "warning";
  onClose?: () => void;
};

const toneClasses = {
  success: "border-[#8dd2bc] bg-[#effaf4] text-[#20533d]",
  info: "border-[#97c7d9] bg-[#eff8fb] text-[#1f5366]",
  warning: "border-[#e1c28d] bg-[#fff8ea] text-[#75531d]",
};

export default function CreativeToast({
  open,
  title,
  message,
  tone = "success",
  onClose,
}: CreativeToastProps) {
  useEffect(() => {
    if (!open || !onClose) {
      return;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="creative-toast fixed right-4 top-4 z-50 w-[min(92vw,360px)] rounded-2xl border p-4 shadow-2xl backdrop-blur-sm">
      <div className={`rounded-xl border px-4 py-3 ${toneClasses[tone]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em]">
              {title}
            </p>
            <p className="mt-1 text-sm leading-6">{message}</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2 text-lg font-black leading-none opacity-70 transition hover:opacity-100"
              aria-label="Close notification"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
