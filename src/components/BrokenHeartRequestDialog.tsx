import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HeartCrack, X, Check } from "lucide-react";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
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
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [acceptReason, setAcceptReason] = useState("");
  const [showAcceptReason, setShowAcceptReason] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    if (showAcceptReason && !acceptReason.trim()) {
      toast({
        title: "Please add a message",
        description: "Let your partner know why you're ready to start fresh.",
        variant: "destructive"
      });
      return;
    }

    if (!showAcceptReason) {
      setShowAcceptReason(true);
      return;
    }

    setIsProcessing(true);
    try {
      // Send acceptance response to partner
      await addDoc(collection(db, 'grievances'), {
        type: "partner_response",
        accepted: true,
        reason: acceptReason.trim(),
        partnerNickname: request.receiverNickname || currentUserEmail,
        senderEmail: currentUserEmail,
        receiverEmail: request.senderEmail,
        timestamp: serverTimestamp()
      });

      // Delete the original request
      await deleteDoc(doc(db, 'grievances', request.id));

      toast({
        title: "Response Sent! 💕",
        description: "Your partner will see your acceptance and can proceed with clearing all grievances.",
      });

      onClose();
    } catch (error) {
      console.error("Error sending acceptance:", error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (showReasonInput && !declineReason.trim()) {
      toast({
        title: "Please add a reason",
        description: "Help your partner understand your perspective.",
        variant: "destructive"
      });
      return;
    }

    if (!showReasonInput) {
      setShowReasonInput(true);
      return;
    }

    setIsProcessing(true);
    try {
      // Send decline response to partner
      await addDoc(collection(db, 'grievances'), {
        type: "partner_response",
        accepted: false,
        reason: declineReason.trim(),
        partnerNickname: request.receiverNickname || currentUserEmail,
        senderEmail: currentUserEmail,
        receiverEmail: request.senderEmail,
        timestamp: serverTimestamp()
      });

      // Delete the original request
      await deleteDoc(doc(db, 'grievances', request.id));

      toast({
        title: "Response Sent",
        description: "Your partner has been notified of your decision.",
      });

      onClose();
    } catch (error) {
      console.error("Error sending decline:", error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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

            {showAcceptReason && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Share why you're ready to start fresh (optional):
                </label>
                <Textarea
                  value={acceptReason}
                  onChange={(e) => setAcceptReason(e.target.value)}
                  placeholder="I'm ready because..."
                  rows={3}
                  className="w-full"
                />
              </div>
            )}

            {showReasonInput && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Please explain why you're not ready yet:
                </label>
                <Textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="I need more time because..."
                  rows={3}
                  className="w-full"
                />
              </div>
            )}

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
                {showAcceptReason ? (isProcessing ? "Sending..." : "Send Accept") : "Accept"}
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isProcessing}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                {showReasonInput ? (isProcessing ? "Sending..." : "Send Decline") : "Decline"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
