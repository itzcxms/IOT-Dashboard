import React from "react";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal popup for discovery point content
 * Light mode style with scrollable content
 */
function DiscoveryModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  content, 
  links = [] 
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
          "max-w-lg mx-auto",
          "bg-white rounded-xl shadow-2xl",
          "max-h-[80vh] overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className={cn(
              "absolute top-3 right-3",
              "w-8 h-8 rounded-full",
              "flex items-center justify-center",
              "bg-gray-100 hover:bg-gray-200",
              "transition-colors"
            )}
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 pr-10">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {content}
          </div>
          
          {/* Links */}
          {links.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2",
                    "text-blue-600 hover:text-blue-800",
                    "text-sm font-medium",
                    "transition-colors"
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DiscoveryModal;
