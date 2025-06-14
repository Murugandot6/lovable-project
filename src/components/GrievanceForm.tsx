import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface GrievanceFormProps {
  onBack: () => void;
  onSuccess: () => void;
  userData: any;
}

export const GrievanceForm = ({ onBack, onSuccess, userData }: GrievanceFormProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [mood, setMood] = useState("confused");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!currentUser?.email || !userData?.partnerEmail) {
        console.error("Current user or partner email is missing.");
        toast({
          title: "Error",
          description: "Failed to submit grievance. User or partner information is incomplete.",
          variant: "destructive",
        });
        return;
      }

      const grievanceData = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        status: "pending",
        timestamp: serverTimestamp(),
        senderNickname: userData.nickname || '',
        senderEmail: currentUser.email,
        receiverEmail: userData.partnerEmail,
        senderId: currentUser?.uid || '',
        receiverId: '', // Will be filled when partner responds
        mood: mood,
        responses: [],
      };

      console.log("Submitting grievance:", grievanceData);

      await addDoc(collection(db, 'grievances'), grievanceData);

      toast({
        title: "Grievance Submitted! 🚀",
        description: "Your concern has been sent to your partner.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting grievance:", error);
      toast({
        title: "Error",
        description: "Failed to submit grievance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodOptions = [
    { value: "frustrated", label: "😤 Frustrated", color: "text-red-500" },
    { value: "sad", label: "😢 Sad", color: "text-blue-500" },
    { value: "confused", label: "😕 Confused", color: "text-yellow-500" },
    { value: "angry", label: "😠 Angry", color: "text-red-600" },
    { value: "disappointed", label: "😞 Disappointed", color: "text-gray-500" },
    { value: "hopeful", label: "🤞 Hopeful", color: "text-green-500" },
    { value: "love", label: "💕 Love", color: "text-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 flex items-center">
              <Heart className="mr-2" size={24} />
              Submit a New Grievance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title of Concern
              </label>
              <Input
                type="text"
                placeholder="A brief summary of your concern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the Issue
              </label>
              <Textarea
                placeholder="Explain the situation, how it makes you feel, and what you need."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Mood
                </label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              {isSubmitting ? (
                <>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={16} />
                  Submit Grievance
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
