"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Barcode } from "lucide-react";
import {
  BrowserMultiFormatReader,
} from "@zxing/browser";
import { IScannerControls } from "@zxing/browser";
import { NotFoundException, Result } from "@zxing/library";

type Props = {
  onDetected: (code: string) => Promise<void> | void;
};

const DUPLICATE_SCAN_COOLDOWN_MS = 1200;

export function BarcodeScannerButton({ onDetected }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScanRef = useRef<{ text: string; at: number } | null>(null);
  const isProcessingRef = useRef(false);
  const onDetectedRef = useRef(onDetected);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;

    isProcessingRef.current = false;
    setIsActive(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Leitura por câmera não é suportada.");
      return;
    }

    try {
      setError("");

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      controlsRef.current = await reader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
          },
        },
        undefined,
        async (result: Result | undefined, err) => {
          if (err && !(err instanceof NotFoundException)) {
            setError("Não foi possível ler o código agora.");
            return;
          }

          if (!result || isProcessingRef.current) return;

          const text = result.getText().trim();
          if (!text) return;

          const now = Date.now();
          const lastScan = lastScanRef.current;
          if (
            lastScan &&
            lastScan.text === text &&
            now - lastScan.at < DUPLICATE_SCAN_COOLDOWN_MS
          ) {
            return;
          }

          lastScanRef.current = { text, at: now };
          isProcessingRef.current = true;

          try {
            await onDetectedRef.current(text);
          } finally {
            isProcessingRef.current = false;
          }
        },
      );

      setIsActive(true);
    } catch {
      stopScanner();
      setError("Permita o acesso à câmera para usar o leitor.");
    }
  }, [stopScanner]);

  useEffect(() => {
    return () => stopScanner();
  }, [stopScanner]);

  const toggleScanner = useCallback(() => {
    if (isActive) {
      stopScanner();
      return;
    }

    void startScanner();
  }, [isActive, startScanner, stopScanner]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggleScanner}
        className={`flex h-6 w-6 items-center justify-center border transition-colors ${
          isActive
            ? "border-black bg-black text-white"
            : "border-primary text-primary"
        }`}
        aria-pressed={isActive}
        aria-label={isActive ? "desativar leitor de código" : "ativar leitor de código"}
      >
        <Barcode size={16} />
      </button>

      {(error) && (
        <p className={`text-center text-xs ${error ? "text-red-500" : "text-tertiary"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
