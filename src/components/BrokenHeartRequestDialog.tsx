
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartCrack, X, Check } from "lucide-react";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface BrokenHeartRequest {
  id: string;
  title: string;
  description: string;
  senderNickname: string;
  senderEmail: string;
  receiverEmail: string;
  timestamp: any;
}

interface BrokenHeartRequestDialogProps {
  request: BrokenHeartRequest;
  onClose: () => void;
  currentUserEmail: string;
}

export const BrokenHeartRequestDialog = ({ request, onClose, currentUserEmail }: BrokenHeartRequestDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      // Delete all grievances for both users
      const grievancesQuery1 = query(
        collection(db, 'grievances'),
        where('senderEmail', '==', request.senderEmail)
      );
      const grievancesQuery2 = query(
        collection(db, 'grievances'),
        where('receiverEmail', '==', request.senderEmail)
      );
      const grievancesQuery3 = query(
        collection(db, 'grievances'),
        where('senderEmail', '==', currentUserEmail)
      );
      const grievancesQuery4 = query(
        collection(db, 'grievances'),
        where('receiverEmail', '==', currentUserEmail)
      );

      const [snapshot1, snapshot2, snapshot3, snapshot4] = await Promise.all([
        getDocs(grievancesQuery1),
        getDocs(grievancesQuery2),
        getDocs(grievancesQuery3),
        getDocs(grievancesQuery4)
      ]);

      const deletePromises = [
        ...snapshot1.docs.map(doc => deleteDoc(doc.ref)),
        ...snapshot2.docs.map(doc => deleteDoc(doc.ref)),
        ...snapshot3.docs.map(doc => deleteDoc(doc.ref)),
        ...snapshot4.docs.map(doc => deleteDoc(doc.ref))
      ];

      await Promise.all(deletePromises);

      toast({
        title: "All Grievances Cleared! 💕",
        description: "You and your partner are starting fresh together.",
      });

      onClose();
    } catch (error) {
      console.error("Error clearing grievances:", error);
      toast({
        title: "Error",
        description: "Failed to clear grievances. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    try {
      await deleteDoc(doc(db, 'grievances', request.id));
      toast({
        title: "Request Declined",
        description: "The clear all request has been declined.",
      });
      onClose();
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Error",
        description: "Failed to decline request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border-red-200 shadow-2xl">
        <CardHeader className="bg-red-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-red-600 flex items-center">
              <HeartCrack className="mr-2" size={24} />
              Clear All Grievances Request
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
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {request.senderNickname} wants to start fresh! 💔
              </p>
              <p className="text-gray-600">
                They've requested to clear all grievances between you both.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Their reason:</p>
              <p className="text-gray-800 italic">"{request.description}"</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                ⚠️ This will permanently delete all grievances for both of you.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="mr-2" size={16} />
                {isProcessing ? "Clearing..." : "Accept & Clear All"}
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isProcessing}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                Decline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
