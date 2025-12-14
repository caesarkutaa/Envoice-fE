"use client";

import { useState, useEffect } from "react";
import { Eye, Check, Sparkles, Download, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ ADD THIS

interface Template {
  id: string;
  name: string;
  description: string;
  colorScheme: string;
  bestFor: string;
  features: string[];
}

interface TemplateSelectorProps {
  value: string;
  onChange: (template: string) => void;
  showPreview?: boolean;
}

export default function TemplateSelector({
  value,
  onChange,
  showPreview = true,
}: TemplateSelectorProps) {
  const { accessToken } = useAuth(); // ✅ GET TOKEN FROM CONTEXT
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    // ✅ Only fetch if we have a token
    if (accessToken) {
      fetchTemplates();
    } else {
      setError("Not authenticated. Please log in.");
      setLoading(false);
    }
  }, [accessToken]); // ✅ Re-fetch when token changes

  const fetchTemplates = async () => {
    try {
      console.log("🔍 Fetching templates from:", `${process.env.NEXT_PUBLIC_API_URL}/invoices/templates`);
      console.log("🔑 Token exists:", !!accessToken);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/templates`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ USE TOKEN FROM CONTEXT
          },
        }
      );

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Templates data:", data);
        
        if (data.templates && Array.isArray(data.templates)) {
          setTemplates(data.templates);
          
          // Set default template if available and no value set
          if (!value && data.default) {
            onChange(data.default);
          }
        } else {
          setError("Invalid templates data received");
          console.error("❌ Invalid data structure:", data);
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        setError(`Failed to fetch templates: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (templateId: string) => {
    setPreviewLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/templates/${templateId}/preview`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ USE TOKEN FROM CONTEXT
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        alert("Failed to generate preview");
      }
    } catch (error) {
      console.error("Failed to generate preview:", error);
      alert("Failed to generate preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const downloadPreview = () => {
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `${value.toLowerCase()}-preview.pdf`;
      link.click();
    }
  };

  const getColorClasses = (colorScheme: string) => {
    switch (colorScheme) {
      case "indigo-purple":
        return {
          bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
          border: "border-indigo-600",
          text: "text-indigo-600",
          hover: "hover:border-indigo-500",
        };
      case "amber-gold":
        return {
          bg: "bg-gradient-to-br from-amber-400 to-orange-500",
          border: "border-amber-600",
          text: "text-amber-600",
          hover: "hover:border-amber-500",
        };
      case "pink-rose":
        return {
          bg: "bg-gradient-to-br from-pink-500 to-rose-600",
          border: "border-pink-600",
          text: "text-pink-600",
          hover: "hover:border-pink-500",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-400 to-gray-600",
          border: "border-gray-600",
          text: "text-gray-600",
          hover: "hover:border-gray-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
        <p className="text-sm text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-1">Failed to Load Templates</h3>
            <p className="text-sm text-red-700 mb-3">{error}</p>
            {accessToken && (
              <button
                onClick={fetchTemplates}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded border border-red-200">
          <p className="text-xs text-gray-600 font-mono">
            API URL: {process.env.NEXT_PUBLIC_API_URL}/invoices/templates
          </p>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Token: {accessToken ? "✓ Present" : "✗ Missing"}
          </p>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Check browser console (F12) for more details
          </p>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">No Templates Available</h3>
            <p className="text-sm text-yellow-700">No invoice templates were found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-4">
        Choose Invoice Template
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {templates.map((template) => {
          const colors = getColorClasses(template.colorScheme);
          const isSelected = value === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onChange(template.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? `${colors.border} bg-gray-50 shadow-lg scale-105`
                  : `border-gray-300 ${colors.hover} hover:shadow-md`
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg z-10">
                  <Check size={16} />
                </div>
              )}

              {/* Template Preview Box */}
              <div
                className={`h-32 ${colors.bg} rounded-t-xl p-4 flex items-center justify-center relative overflow-hidden`}
              >
                <Sparkles
                  className="text-white opacity-20 absolute top-2 right-2"
                  size={24}
                />
                <div className="text-white text-center">
                  <div className="font-bold text-2xl mb-1">{template.name}</div>
                  <div className="text-xs opacity-90">{template.colorScheme}</div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">BEST FOR:</p>
                  <p className="text-xs text-gray-700">{template.bestFor}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">FEATURES:</p>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-1"
                      >
                        <Check size={12} className={colors.text} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preview Button */}
                {showPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template.id);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 border-2 ${colors.border} ${colors.text} rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold`}
                  >
                    <Eye size={16} />
                    Preview Sample
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setPreviewUrl(null)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">Template Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadPreview}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-3"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="flex-1 overflow-auto p-4">
                <iframe
                  src={previewUrl}
                  className="w-full h-full min-h-[600px] border rounded-lg"
                  title="Template Preview"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preview Loading */}
      {previewLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Generating preview...</p>
          </div>
        </div>
      )}
    </div>
  );
}