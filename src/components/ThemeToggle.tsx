
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="border-pink-300 hover:bg-pink-50 dark:border-pink-700 dark:hover:bg-pink-900/20"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
      ) : (
        <Sun className="h-4 w-4 text-pink-600 dark:text-pink-400" />
      )}
    </Button>
  );
};
