import React from "react";
import { X, Globe, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

// Liens réseaux sociaux
const socialLinks = {
  instagram: "https://www.instagram.com/loiretcher_en_valdeloire/",
  facebook: "https://www.facebook.com/Loir.et.Cher.en.Val.de.Loire",
};

/**
 * Modal popup for discovery point content
 * Horizontal layout: image left, content right (mobile: stacked)
 */
function DiscoveryModal({
  isOpen,
  onClose,
  title,
  subtitle,
  content,
  activities,
  image,
  links = [],
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-50",
          "left-4 right-4 top-1/2 -translate-y-1/2",
          "md:left-1/2 md:-translate-x-1/2 md:right-auto",
          "md:max-w-3xl md:w-full",
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
            "bg-white/90 hover:bg-gray-100",
            "transition-colors shadow-sm",
          )}
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Layout container */}
        <div className="flex flex-col md:flex-row max-h-[85vh]">
          {/* Image section */}
          {image && (
            <div className="md:w-2/5 shrink-0">
              <img
                src={image}
                alt={title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          )}

          {/* Content section */}
          <div className="flex-1 flex flex-col p-5 md:p-6 overflow-y-auto">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pr-8 mb-3">
              {subtitle || title}
            </h2>

            {/* Description */}
            <div className="text-gray-600 text-sm leading-relaxed mb-4">
              {content}
            </div>

            {/* Activities section */}
            {activities && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Activités :
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activities}
                </p>
              </div>
            )}

            {/* Spacer to push links to bottom */}
            <div className="flex-grow"></div>

            {/* Links and Social Icons Container - Fixed at bottom */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              {/* Site Links */}
              <div className="flex flex-wrap items-center gap-2">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2",
                      "text-blue-600 hover:text-blue-800",
                      "text-sm font-medium",
                      "transition-colors",
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Social Media Icons - Bottom Right */}
              <div className="flex items-center gap-3">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscoveryModal;
