
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HeartCrack, X } from "lucide-react";

interface BrokenHeartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const BrokenHeartDialog = ({ isOpen, onClose, onSubmit }: BrokenHeartDialogProps) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      setReason("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-red-600 flex items-center">
              <HeartCrack className="mr-2" size={24} />
              Clear All Grievances
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              This will send a request to your partner to clear all grievances. Both of you need to agree for this to happen.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for clearing all grievances:
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why you want to start fresh..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!reason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <HeartCrack className="mr-2" size={16} />
                Send Request
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
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
