// src/components/attendance/AttendanceScanner.tsx (version corrigée)

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAttendance } from "@/hooks/useAttendance";
import { validateStudentCode } from "@/utils/attendanceUtils";
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle,
  XCircle,
  Loader2,
  Smartphone,
  RefreshCw,
  Scan,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface AttendanceScannerProps {
  classId: string;
  session: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const AttendanceScanner: React.FC<AttendanceScannerProps> = ({
  classId,
  session,
  onSuccess,
  onError,
}) => {
  const [mode, setMode] = useState<"manual" | "camera">("manual");
  const [studentCode, setStudentCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [scannerReady, setScannerReady] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const { recordByScan, loading } = useAttendance();

  const scannerId = useRef(
    `qr-reader-${Math.random().toString(36).substr(2, 9)}`,
  );

  // Fonction pour vérifier les caméras disponibles
  const checkCameras = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      setScannerReady(false);

      // Vérifier le support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Votre navigateur ne supporte pas l'accès à la caméra");
      }

      // Demander la permission
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        testStream.getTracks().forEach((track) => track.stop());
        setPermissionState("granted");
      } catch (permErr: any) {
        if (
          permErr.name === "NotAllowedError" ||
          permErr.name === "PermissionDeniedError"
        ) {
          setPermissionState("denied");
          setError(
            "Accès à la caméra refusé. Veuillez autoriser l'accès dans les paramètres.",
          );
          setIsInitializing(false);
          return false;
        }
        throw permErr;
      }

      // Lister les caméras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );

      console.log("Caméras trouvées:", videoDevices.length);
      videoDevices.forEach((d, i) => {
        console.log(`Caméra ${i + 1}:`, d.label || "Nom inconnu");
      });

      if (videoDevices.length > 0) {
        setHasCamera(true);
        setIsInitializing(false);
        return true;
      } else {
        setHasCamera(false);
        setError("Aucune caméra trouvée sur cet appareil");
        setIsInitializing(false);
        return false;
      }
    } catch (err: any) {
      console.error("Erreur vérification caméras:", err);
      setHasCamera(false);
      setError(err.message || "Erreur lors de la vérification des caméras");
      setIsInitializing(false);
      return false;
    }
  };

  // Initialiser le scanner et démarrer
  const initAndStartScanner = async () => {
    if (!hasCamera || permissionState !== "granted") return;

    try {
      setError(null);
      setScannerReady(false);

      // S'assurer que le conteneur est présent
      if (!scannerContainerRef.current) {
        throw new Error("Conteneur non trouvé");
      }

      // Nettoyer l'ancien scanner s'il existe
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {}
        scannerRef.current = null;
      }

      // Vider le conteneur
      const container = document.getElementById(scannerId.current);
      if (container) {
        container.innerHTML = "";
      }

      // Créer une nouvelle instance
      scannerRef.current = new Html5Qrcode(scannerId.current);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        videoConstraints: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      setScanning(true);

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Scan réussi
          console.log("QR Code scanné:", decodedText);
          if (navigator.vibrate) navigator.vibrate(200);

          // Pause temporaire
          try {
            await scannerRef.current?.pause();
          } catch (e) {}

          // Enregistrer
          await handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan normales
          if (
            !errorMessage.includes("NotFoundException") &&
            !errorMessage.includes("No MultiFormat Readers")
          ) {
            console.warn("Erreur scan:", errorMessage);
          }
        },
      );

      setScannerReady(true);
    } catch (err: any) {
      console.error("Erreur démarrage scan:", err);
      setError(err.message || "Impossible de démarrer la caméra");
      setScanning(false);
    }
  };

  // Arrêter le scan
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Erreur arrêt scanner:", err);
      }
      scannerRef.current = null;
    }
    setScanning(false);
    setScannerReady(false);
  };

  // Reprendre le scan après une pause
  const resumeScanner = async () => {
    if (scannerRef.current && !scanning) {
      try {
        await scannerRef.current.resume();
        setScanning(true);
      } catch (err) {
        console.error("Erreur reprise scan:", err);
        // Si la reprise échoue, redémarrer
        await initAndStartScanner();
      }
    }
  };

  // Gérer le succès du scan
  const handleScanSuccess = async (code: string) => {
    try {
      const response = await recordByScan(code, classId, session);

      if (response.success) {
        setResult(response);
        onSuccess?.(response);

        // Attendre 3 secondes avant de reprendre le scan
        setTimeout(async () => {
          if (scannerRef.current) {
            try {
              await scannerRef.current.resume();
            } catch (e) {
              console.warn("Erreur reprise scan:", e);
              await initAndStartScanner();
            }
          }
        }, 3000);
      } else {
        setError(response.message);
        onError?.(response.message);
        // Reprendre immédiatement
        setTimeout(async () => {
          if (scannerRef.current) {
            try {
              await scannerRef.current.resume();
            } catch (e) {
              console.warn("Erreur reprise scan:", e);
            }
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
      onError?.(err.message);
      setTimeout(async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.resume();
          } catch (e) {}
        }
      }, 2000);
    }
  };

  // Saisie manuelle
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStudentCode(studentCode)) {
      setError("Format de code invalide (ex: ET1234)");
      return;
    }

    setError(null);
    try {
      const response = await recordByScan(studentCode, classId, session);
      if (response.success) {
        setResult(response);
        setStudentCode("");
        onSuccess?.(response);
      } else {
        setError(response.message);
        onError?.(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
      onError?.(err.message);
    }
  };

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Démarrer le scanner quand les conditions sont réunies
  useEffect(() => {
    if (
      mode === "camera" &&
      hasCamera === true &&
      permissionState === "granted"
    ) {
      initAndStartScanner();
    } else if (mode !== "camera" && scannerRef.current) {
      stopScanner();
    }
  }, [mode, hasCamera, permissionState]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="h-5 w-5 mr-2" />
          Scanner un code étudiant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "manual" | "camera")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual" className="flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              Saisie manuelle
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Scanner caméra
            </TabsTrigger>
          </TabsList>

          {/* Messages d'état */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Présence enregistrée pour {result.student?.name || "l'étudiant"}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="manual">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                placeholder="Code étudiant (ex: ET1234)"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                disabled={loading || result}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || result}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="camera">
            {isInitializing ? (
              <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Vérification de la caméra...
                </p>
              </div>
            ) : hasCamera === false ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <CameraOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Aucune caméra détectée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vérifiez que votre appareil dispose d'une caméra.
                </p>
                <Button variant="outline" onClick={() => setMode("manual")}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Utiliser la saisie manuelle
                </Button>
              </div>
            ) : permissionState === "denied" ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <CameraOff className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="font-medium mb-2">Accès à la caméra bloqué</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Veuillez autoriser l'accès à la caméra dans les paramètres de
                  votre navigateur.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPermissionState("prompt");
                    checkCameras();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            ) : (
              <>
                {/* Conteneur du scanner - TOUJOURS visible en mode caméra */}
                <div
                  ref={scannerContainerRef}
                  id={scannerId.current}
                  className="w-full bg-black rounded-lg overflow-hidden"
                  style={{
                    minHeight: "350px",
                    aspectRatio: "1/1",
                  }}
                />

                {/* Interface de contrôle */}
                {scanning && scannerReady ? (
                  <div className="space-y-4 mt-4">
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Scan en cours...
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={stopScanner}
                      className="w-full"
                    >
                      <CameraOff className="h-4 w-4 mr-2" />
                      Arrêter le scan
                    </Button>
                  </div>
                ) : hasCamera && permissionState === "granted" && !scanning ? (
                  <div className="text-center p-8 bg-muted rounded-lg mt-4">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Le scanner est prêt
                    </p>
                    <Button onClick={resumeScanner}>
                      <Camera className="h-4 w-4 mr-2" />
                      Démarrer le scan
                    </Button>
                  </div>
                ) : null}
              </>
            )}

            {/* Bouton de vérification */}
            {hasCamera === null && !isInitializing && (
              <Button onClick={checkCameras} className="w-full mt-4">
                <Camera className="h-4 w-4 mr-2" />
                Vérifier la caméra
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
