import React from "react";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Info Modal - Credits and legal information
 */
function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-50",
          "left-4 right-4 top-1/2 -translate-y-1/2",
          "md:left-1/2 md:-translate-x-1/2 md:right-auto",
          "md:max-w-lg md:w-full",
          "max-w-sm mx-auto",
          "bg-white rounded-2xl shadow-2xl",
          "max-h-[85vh] overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-3 right-3 z-10",
            "w-8 h-8 rounded-full",
            "flex items-center justify-center",
            "bg-gray-100 hover:bg-gray-200",
            "transition-colors",
          )}
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pr-8">
            À propos de ce projet
          </h2>

          {/* Project info */}
          <div className="space-y-6">
            {/* Students */}
            <div className="text-gray-600 text-sm leading-relaxed">
              <p className="text-gray-900 mb-1">
                Un projet conçu par les étudiants de la F@brique Numérique 41
              </p>
            </div>

            {/* CD41 */}
            <div>
              <p className="font-medium text-gray-900 text-sm mb-2">
                Une initiative portée par :
              </p>
              <a
                href="https://www.departement41.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <img
                  src="/decouverte/logos/cd41.png"
                  alt="Conseil Départemental du Loir-et-Cher"
                  className="h-12"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <span className="hidden items-center gap-1 text-blue-600 text-sm font-medium">
                  Conseil Départemental 41
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            </div>

            {/* Commune */}
            <div>
              <p className="font-medium text-gray-900 text-sm mb-2">
                Découvrez la commune :
              </p>
              <a
                href="https://www.chaumont-sur-loire.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <img
                  src="/decouverte/logos/chaumont.png"
                  alt="Commune de Chaumont-sur-Loire"
                  className="h-12"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <span className="hidden items-center gap-1 text-blue-600 text-sm font-medium">
                  Chaumont-sur-Loire
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            </div>

            {/* Legal */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href="/mentions-legales"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoModal;
