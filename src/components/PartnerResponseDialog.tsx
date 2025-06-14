
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface PartnerResponse {
  id: string;
  accepted: boolean;
  reason?: string;
  partnerNickname: string;
}

interface PartnerResponseDialogProps {
  response: PartnerResponse;
  onClose: () => void;
  onProceed: () => void;
}

export const PartnerResponseDialog = ({ response, onClose, onProceed }: PartnerResponseDialogProps) => {
  const { toast } = useToast();

  const handleClose = async () => {
    try {
      await deleteDoc(doc(db, 'grievances', response.id));
      onClose();
    } catch (error) {
      console.error("Error deleting response:", error);
      onClose();
    }
  };

  const handleProceed = async () => {
    try {
      await deleteDoc(doc(db, 'grievances', response.id));
      onProceed();
    } catch (error) {
      console.error("Error deleting response:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (response.accepted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white border-green-200 shadow-2xl">
          <CardHeader className="bg-green-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-green-600 flex items-center">
                <ThumbsUp className="mr-2" size={24} />
                Great News! 🎉
              </CardTitle>
              <Button
                onClick={handleClose}
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
                  {response.partnerNickname} accepted your request! 💕
                </p>
                <p className="text-gray-600">
                  They're ready to start fresh with you.
                </p>
              </div>
              
              {response.reason && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Their message:</p>
                  <p className="text-gray-800 italic">"{response.reason}"</p>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 Ready to clear all grievances and start over together?
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleProceed}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Heart className="mr-2" size={16} />
                  Yes, Let's Start Fresh!
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border-orange-200 shadow-2xl">
        <CardHeader className="bg-orange-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-orange-600 flex items-center">
              <ThumbsDown className="mr-2" size={24} />
              Partner's Response
            </CardTitle>
            <Button
              onClick={handleClose}
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
                {response.partnerNickname} declined your request 💙
              </p>
              <p className="text-gray-600">
                That's okay! Every relationship moves at its own pace.
              </p>
            </div>
            
            {response.reason && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Their reason:</p>
                <p className="text-gray-800 italic">"{response.reason}"</p>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 Consider talking to your partner about what would help them feel ready to start fresh together.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Heart className="mr-2" size={16} />
              Understood
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
