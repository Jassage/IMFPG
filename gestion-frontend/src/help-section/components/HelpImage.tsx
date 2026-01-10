// Créer un fichier HelpImage.tsx
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface HelpImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const HelpImage: React.FC<HelpImageProps> = ({
  src,
  alt,
  className = "",
  fallback,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Nettoyer le chemin src
  const cleanSrc = src.startsWith("/") ? src : `/help-screenshots/${src}`;

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-pulse flex flex-col items-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Chargement de l'image...</p>
          </div>
        </div>
      )}

      <img
        src={cleanSrc}
        alt={alt}
        className={`rounded-lg border ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          console.error(`Image non trouvée: ${cleanSrc}`);
        }}
      />

      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
          <div className="text-center p-4">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Image non disponible</p>
            <p className="text-gray-400 text-xs mt-1">{alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};
