import React from "react";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Video,
  FileText,
  Table,
} from "lucide-react";
import { HelpContent } from "@/types/help.types";
import { HelpImage } from "./HelpImage";

interface HelpContentRendererProps {
  content: HelpContent;
}

export const HelpContentRenderer: React.FC<HelpContentRendererProps> = ({
  content,
}) => {
  const renderContent = () => {
    switch (content.type) {
      case "steps":
        return renderSteps(content.content);
      case "form":
        return renderForm(content.content);
      case "text":
        return renderText(content.content);
      case "video":
        return renderVideos(content.content);
      case "warning":
        return renderWarning(content.content);
      case "tip":
        return renderTip(content.content);
      default:
        return null;
    }
  };

  const renderSteps = (steps: any) => {
    if (!Array.isArray(steps)) return null;

    return (
      <div className="space-y-4">
        {steps.map((step: any) => (
          <div
            key={step.step}
            className="flex gap-4 p-4 border rounded-lg bg-white"
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {step.step}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
              <p className="text-gray-600 mb-2">{step.description}</p>

              {step.action && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-sm font-medium text-blue-700">
                    Action :{" "}
                  </span>
                  <span className="text-sm text-blue-600">{step.action}</span>
                </div>
              )}

              {step.image && (
                <div className="mt-3">
                  <HelpImage
                    src={step.image}
                    alt={`Capture: ${step.title}`}
                    className="max-w-full h-auto rounded-lg border shadow-sm"
                    fallback={
                      <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📸</div>
                          <p className="text-gray-600">{step.image}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Capture d'écran illustrative
                          </p>
                        </div>
                      </div>
                    }
                  />
                  {step.imageCaption && (
                    <p className="text-xs text-gray-500 mt-2 text-center italic">
                      {step.imageCaption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderForm = (fields: any) => {
    if (!Array.isArray(fields)) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Champ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Règles
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Obligatoire
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-xs text-gray-500">{field.fieldName}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {field.description}
                  {field.examples && (
                    <div className="mt-1">
                      <span className="text-xs font-medium">Exemples : </span>
                      <span className="text-xs text-gray-500">
                        {field.examples.join(", ")}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-600">
                    {field.validationRules || "Aucune"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      field.required
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {field.required ? "Oui" : "Non"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderText = (text: any) => (
    <div className="prose prose-blue max-w-none">
      <p className="text-gray-700 whitespace-pre-line">{text}</p>
    </div>
  );

  const renderVideos = (videos: any) => {
    if (!Array.isArray(videos)) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video: any) => (
          <div key={video.id} className="border rounded-lg overflow-hidden">
            <div className="h-40 bg-gray-800 flex items-center justify-center">
              <Video className="h-12 w-12 text-white" />
            </div>
            <div className="p-4">
              <h4 className="font-semibold">{video.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{video.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{video.duration}</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Regarder →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWarning = (text: any) => (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-800">Attention</h4>
          <p className="text-red-700 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );

  const renderTip = (text: any) => (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-green-800">Astuce</h4>
          <p className="text-green-700 mt-1">{text}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      {/* En-tête du contenu */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          {content.type === "steps" && (
            <CheckCircle className="h-5 w-5 text-blue-500" />
          )}
          {content.type === "form" && (
            <Table className="h-5 w-5 text-indigo-500" />
          )}
          {content.type === "video" && (
            <Video className="h-5 w-5 text-red-500" />
          )}
          {content.type === "warning" && (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
          {content.type === "tip" && (
            <Lightbulb className="h-5 w-5 text-green-500" />
          )}
          {content.title}
        </h3>

        {/* Badge d'importance */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            content.importance === "high"
              ? "bg-red-100 text-red-800"
              : content.importance === "medium"
              ? "bg-amber-100 text-amber-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {content.importance === "high"
            ? "Important"
            : content.importance === "medium"
            ? "Moyen"
            : "Basique"}
        </span>
      </div>

      {/* Contenu */}
      <div className="mt-4">{renderContent()}</div>

      {/* Cible de rôle */}
      {content.targetRole && content.targetRole.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Destiné aux :{" "}
            <span className="font-medium">
              {content.targetRole.map((r) => r.toLowerCase()).join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
