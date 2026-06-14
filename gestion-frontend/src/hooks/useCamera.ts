// src/hooks/useCamera.ts

import { useState, useEffect, useCallback, useRef } from "react";

interface UseCameraOptions {
  deviceId?: string;
  onError?: (error: Error) => void;
  onSuccess?: (stream: MediaStream) => void;
}

export const useCamera = (options?: UseCameraOptions) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>(
    options?.deviceId || "",
  );
  const [permission, setPermission] = useState<"prompt" | "granted" | "denied">(
    "prompt",
  );
  const [error, setError] = useState<Error | null>(null);
  const [isActive, setIsActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Vérifier les permissions
  const checkPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermission(result.state);

      result.addEventListener("change", () => {
        setPermission(result.state);
      });
    } catch (e) {
      console.error("Erreur vérification permission:", e);
    }
  }, []);

  // Obtenir la liste des caméras
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId);
      }

      return videoDevices;
    } catch (e) {
      console.error("Erreur récupération caméras:", e);
      return [];
    }
  }, [selectedDevice]);

  // Démarrer la caméra
  const startCamera = useCallback(
    async (deviceId?: string) => {
      try {
        setError(null);

        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
          audio: false,
        };

        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setIsActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setPermission("granted");
        await getDevices();

        options?.onSuccess?.(mediaStream);

        return mediaStream;
      } catch (e: any) {
        console.error("Erreur démarrage caméra:", e);
        setError(e);
        setIsActive(false);

        if (e.name === "NotAllowedError") {
          setPermission("denied");
        }

        options?.onError?.(e);
        throw e;
      }
    },
    [stream, getDevices, options],
  );

  // Arrêter la caméra
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
      setIsActive(false);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Changer de caméra
  const switchCamera = useCallback(
    async (deviceId: string) => {
      if (deviceId === selectedDevice) return;

      setSelectedDevice(deviceId);
      await startCamera(deviceId);
    },
    [selectedDevice, startCamera],
  );

  // Prendre une photo
  const takePhoto = useCallback((): string | null => {
    if (!videoRef.current || !stream) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  }, [stream]);

  // Vérifier le support navigateur
  const isSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  useEffect(() => {
    checkPermission();
    getDevices();

    return () => {
      stopCamera();
    };
  }, [checkPermission, getDevices, stopCamera]);

  return {
    stream,
    devices,
    selectedDevice,
    permission,
    error,
    isActive,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
    getDevices,
    isSupported: isSupported(),
  };
};
