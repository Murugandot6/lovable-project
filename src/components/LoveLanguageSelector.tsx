
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LOVE_LANGUAGES, LoveLanguage } from "@/types/relationship";
import { Check } from "lucide-react";

interface LoveLanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageToggle: (languageId: string) => void;
  maxSelections?: number;
}

export const LoveLanguageSelector = ({ 
  selectedLanguages, 
  onLanguageToggle, 
  maxSelections = 2 
}: LoveLanguageSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">
          Choose Your Love Languages
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Select up to {maxSelections} ways you best receive love
        </p>
      </div>
      
      <div className="grid gap-3">
        {LOVE_LANGUAGES.map((language) => {
          const isSelected = selectedLanguages.includes(language.id);
          const canSelect = selectedLanguages.length < maxSelections || isSelected;
          
          return (
            <Card 
              key={language.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-400 dark:border-pink-600 ring-2 ring-pink-300 dark:ring-pink-600' 
                  : canSelect
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canSelect && onLanguageToggle(language.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {language.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {language.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-pink-500 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
