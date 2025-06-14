
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface GrievanceFormProps {
  onBack: () => void;
  onSubmitted: () => void;
}

const moodOptions = [
  { value: "😊 Happy", label: "😊 Happy" },
  { value: "😢 Sad", label: "😢 Sad" },
  { value: "😠 Angry", label: "😠 Angry" },
  { value: "😰 Anxious", label: "😰 Anxious" },
  { value: "😔 Disappointed", label: "😔 Disappointed" },
  { value: "😕 Confused", label: "😕 Confused" },
  { value: "😤 Frustrated", label: "😤 Frustrated" },
  { value: "😞 Hurt", label: "😞 Hurt" },
  { value: "😟 Worried", label: "😟 Worried" },
  { value: "🤔 Thoughtful", label: "🤔 Thoughtful" }
];

export const GrievanceForm = ({ onBack, onSubmitted }: GrievanceFormProps) => {
  const { toast } = useToast();
  const { currentUser, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [formData, setFormData] = useState({
    concernTitle: "",
    description: "",
    priority: "",
    desiredOutcome: "",
    mood: ""
  });

  useEffect(() => {
    const loadPartnerData = async () => {
      if (userData?.partnerEmail) {
        try {
          const partnerQuery = query(
            collection(db, 'users'),
            where('email', '==', userData.partnerEmail)
          );
          const partnerSnapshot = await getDocs(partnerQuery);
          if (!partnerSnapshot.empty) {
            const partner = partnerSnapshot.docs[0].data();
            setPartnerData(partner);
          }
        } catch (error) {
          console.error("Error loading partner data:", error);
        }
      }
    };

    loadPartnerData();
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Starting grievance submission...");
    console.log("Current user:", !!currentUser);
    console.log("User data:", userData);
    console.log("Form data:", formData);
    
    if (!currentUser) {
      console.error("No current user found");
      toast({
        title: "Error",
        description: "You must be logged in to submit a grievance.",
        variant: "destructive"
      });
      return;
    }

    if (!userData || !userData.nickname || !userData.partnerEmail) {
      console.error("Missing userData or required fields:", userData);
      toast({
        title: "Error",
        description: "Please complete your profile before submitting a grievance.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.concernTitle || !formData.description || !formData.priority || !formData.mood) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Looking for partner with email:", userData.partnerEmail);
      
      let partnerId = null;
      const partnerQuery = query(
        collection(db, 'users'), 
        where('email', '==', userData.partnerEmail)
      );
      const partnerSnapshot = await getDocs(partnerQuery);
      
      if (!partnerSnapshot.empty) {
        partnerId = partnerSnapshot.docs[0].id;
        console.log("Found partner with ID:", partnerId);
      } else {
        console.log("Partner not found, continuing without partnerId");
      }

      const grievanceData = {
        title: formData.concernTitle,
        description: formData.description,
        priority: formData.priority,
        desiredOutcome: formData.desiredOutcome,
        mood: formData.mood,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderNickname: userData.nickname,
        senderEmail: currentUser.email,
        receiverId: partnerId,
        receiverEmail: userData.partnerEmail,
        status: "Pending"
      };

      console.log("Submitting grievance data:", grievanceData);

      const docRef = await addDoc(collection(db, 'grievances'), grievanceData);
      console.log("Grievance saved with ID:", docRef.id);
      
      toast({
        title: "Concern Submitted Successfully! 💕",
        description: "Your concern has been recorded. Check the dashboard to track progress.",
      });
      
      onSubmitted();
    } catch (error) {
      console.error("Detailed grievance submission error:", error);
      toast({
        title: "Submission Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-pink-600" size={24} />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Share Your Concern
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Express your feelings to {partnerData?.nickname || userData?.partnerEmail} in a safe space
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Concern Title</Label>
                <Input
                  id="title"
                  value={formData.concernTitle}
                  onChange={(e) => setFormData({...formData, concernTitle: e.target.value})}
                  placeholder="Brief title for your concern"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood" className="text-gray-700">How are you feeling?</Label>
                <Select value={formData.mood} onValueChange={(value) => setFormData({...formData, mood: value})}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-700">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait</SelectItem>
                    <SelectItem value="medium">Medium - Should address soon</SelectItem>
                    <SelectItem value="high">High - Needs immediate attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your concern in detail. What happened? How did it make you feel?"
                  required
                  rows={5}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome" className="text-gray-700">Desired Outcome</Label>
                <Textarea
                  id="outcome"
                  value={formData.desiredOutcome}
                  onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})}
                  placeholder="What would you like to see happen? How can this be resolved?"
                  required
                  rows={3}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="mr-2" size={20} />
                {isSubmitting ? 'Submitting...' : 'Submit Concern'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
