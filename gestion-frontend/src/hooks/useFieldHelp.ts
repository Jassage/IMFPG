import React from "react";
import { HelpCircle } from "lucide-react";
import { useHelp } from "../help-section/context/HelpContext";

export const useFieldHelp = (fieldName: string, section?: string) => {
  const { openHelp } = useHelp();

  const showHelp = () => {
    if (section) {
      openHelp(section as any);
    } else {
      openHelp();
    }
  };

  const HelpButton: React.FC = () =>
    React.createElement(
      "button",
      {
        onClick: showHelp,
        className: "inline-flex items-center ml-1 text-gray-400 hover:text-blue-500",
        title: `Aide pour ${fieldName}`,
      },
      React.createElement(HelpCircle, { className: "h-4 w-4" })
    );

  return {
    showHelp,
    HelpButton,
  };
};
