
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartCrack, X, AlertTriangle } from "lucide-react";

interface ClearAllConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearAllConfirmationDialog = ({ onConfirm, onCancel }: ClearAllConfirmationDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border-orange-200 shadow-2xl">
        <CardHeader className="bg-orange-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-orange-600 flex items-center">
              <AlertTriangle className="mr-2" size={24} />
              Final Confirmation
            </CardTitle>
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Are you absolutely sure? 💭
              </p>
              <p className="text-gray-600">
                This will permanently delete ALL grievances between you and your partner.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium mb-2">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-red-700">
                All your relationship concerns, responses, and progress will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <HeartCrack className="mr-2" size={16} />
                Yes, Clear Everything
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
