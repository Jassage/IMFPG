// src/components/help/ImageGallery.tsx
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { HelpImage } from "./HelpImage";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description?: string;
  role?: "admin" | "secretaire" | "professeur" | "directeur";
  category?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  description?: string;
  viewMode?: "grid" | "list";
  filterable?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title = "Galerie des captures",
  description,
  viewMode: initialViewMode = "grid",
  filterable = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extraire les rôles et catégories uniques
  const roles = Array.from(new Set(images.map((img) => img.role || "all")));
  const categories = Array.from(
    new Set(images.map((img) => img.category || "non-catégorisé"))
  );

  // Filtrer les images
  const filteredImages = images.filter((img) => {
    const roleMatch =
      selectedRole === "all" ||
      img.role === selectedRole ||
      img.role === undefined;
    const categoryMatch =
      selectedCategory === "all" ||
      img.category === selectedCategory ||
      img.category === undefined;
    return roleMatch && categoryMatch;
  });

  const openImage = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigate = (direction: "prev" | "next") => {
    if (!selectedImage) return;

    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;

    setSelectedImage(filteredImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && (
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          )}
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-4">
          {filterable && (
            <div className="flex items-center gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "Tous" : role}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
              title="Vue grille"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
              title="Vue liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Galerie */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}
      >
        {filteredImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={cn(
              "group cursor-pointer transition-all hover:scale-[1.02]",
              viewMode === "list" &&
                "flex gap-4 items-start border rounded-lg p-4 hover:bg-gray-50"
            )}
            onClick={() => openImage(image, index)}
          >
            {viewMode === "grid" ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={
                      image.src.startsWith("/")
                        ? image.src
                        : `/help-assets/annotated/${image.src}`
                    }
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {image.title}
                  </h4>
                  {image.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  {image.role && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {image.role}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex-shrink-0 w-32 h-24 rounded overflow-hidden">
                  <img
                    src={
                      image.src.startsWith("/")
                        ? image.src
                        : `/help-assets/annotated/${image.src}`
                    }
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{image.title}</h4>
                  {image.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {image.role && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {image.role}
                      </span>
                    )}
                    {image.category && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {image.category}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal de visualisation */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh]">
            {/* Bouton fermer */}
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigate("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={() => navigate("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Image */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="max-h-[70vh] overflow-auto">
                <img
                  src={
                    selectedImage.src.startsWith("/")
                      ? selectedImage.src
                      : `/help-assets/annotated/${selectedImage.src}`
                  }
                  alt={selectedImage.alt}
                  className="w-full h-auto"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedImage.title}
                    </h3>
                    {selectedImage.description && (
                      <p className="text-gray-600 mt-2">
                        {selectedImage.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedImage.role && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {selectedImage.role}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {currentIndex + 1} / {filteredImages.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aucune image */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <div className="text-gray-400 mb-4">
            <Grid className="h-12 w-12 mx-auto" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Aucune image trouvée
          </h4>
          <p className="text-gray-500">
            Aucune capture ne correspond aux filtres sélectionnés
          </p>
        </div>
      )}
    </div>
  );
};
