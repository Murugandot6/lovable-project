
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Grievance {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  timestamp: any;
  senderNickname: string;
  senderEmail: string;
  receiverEmail: string;
  responses?: Array<{
    id: string;
    message: string;
    responderId: string;
    responderNickname: string;
    timestamp: any;
  }>;
}

interface GrievanceResponseProps {
  grievance: Grievance;
  onBack: () => void;
}

export const GrievanceResponse = ({ grievance, onBack }: GrievanceResponseProps) => {
  const { toast } = useToast();
  const { currentUser, userData } = useAuth();
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast({
        title: "Please enter a response",
        description: "Response cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser || !userData) {
      toast({
        title: "Authentication Error",
        description: "Please log in to respond.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = {
        id: Date.now().toString(),
        message: responseText,
        responderId: currentUser.uid,
        responderNickname: userData.nickname,
        timestamp: Timestamp.now()
      };

      await updateDoc(doc(db, 'grievances', grievance.id), {
        responses: arrayUnion(response),
        status: 'responded'
      });

      toast({
        title: "Response Sent! 💕",
        description: "Your response has been sent to your partner.",
      });

      setResponseText("");
      onBack();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        {/* Grievance Details */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  {grievance.title}
                </CardTitle>
                <div className="flex gap-2 mb-4">
                  <Badge className={getPriorityColor(grievance.priority)}>
                    {grievance.priority} priority
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {grievance.status}
                  </Badge>
                </div>
              </div>
              <Heart className="text-pink-500" size={24} />
            </div>
            <p className="text-gray-600">
              From: <strong>{grievance.senderNickname}</strong> • 
              {grievance.timestamp && new Date(grievance.timestamp.toDate()).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{grievance.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Responses */}
        {grievance.responses && grievance.responses.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-600">Previous Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grievance.responses.map((response) => (
                  <div key={response.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-purple-800">{response.responderNickname}</span>
                      <span className="text-xs text-gray-500">
                        {response.timestamp && new Date(response.timestamp.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-pink-600 flex items-center">
              <Heart className="mr-2" size={20} />
              Your Response & Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts and proposed solution:
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Express your understanding of the concern and propose a solution that works for both of you..."
                  rows={6}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !responseText.trim()}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold"
              >
                <Send className="mr-2" size={16} />
                {isSubmitting ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
