
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Send, Smile, Star, MessageSquareHeart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface MessageFormProps {
  onBack: () => void;
  onSuccess: () => void;
  userData: any;
}

const messageTypes = [
  { 
    value: "grievance", 
    label: "💔 Grievance", 
    color: "bg-red-50 border-red-200",
    headerColor: "text-red-600",
    buttonColor: "bg-red-500 hover:bg-red-600",
    icon: Heart
  },
  { 
    value: "compliment", 
    label: "💕 Compliment", 
    color: "bg-pink-50 border-pink-200",
    headerColor: "text-pink-600",
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    icon: MessageSquareHeart
  },
  { 
    value: "memory", 
    label: "✨ Good Memory", 
    color: "bg-yellow-50 border-yellow-200",
    headerColor: "text-yellow-600",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    icon: Star
  },
  { 
    value: "feeling", 
    label: "🌈 How I Feel", 
    color: "bg-purple-50 border-purple-200",
    headerColor: "text-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    icon: Smile
  }
];

export const MessageForm = ({ onBack, onSuccess, userData }: MessageFormProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [mood, setMood] = useState("happy");
  const [messageType, setMessageType] = useState("grievance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMessageType = messageTypes.find(type => type.value === messageType) || messageTypes[0];

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
          description: "Failed to submit message. User or partner information is incomplete.",
          variant: "destructive",
        });
        return;
      }

      const messageData = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        status: messageType === 'grievance' ? 'pending' : 'sent',
        timestamp: serverTimestamp(),
        senderNickname: userData.nickname || '',
        senderEmail: currentUser.email,
        receiverEmail: userData.partnerEmail,
        senderId: currentUser?.uid || '',
        receiverId: '',
        mood: mood,
        responses: [],
        messageType: messageType,
        type: 'message'
      };

      console.log("Submitting message:", messageData);

      await addDoc(collection(db, 'grievances'), messageData);

      const typeLabels = {
        grievance: "Grievance",
        compliment: "Compliment",
        memory: "Good Memory",
        feeling: "Feeling"
      };

      toast({
        title: `${typeLabels[messageType as keyof typeof typeLabels]} Sent! 🚀`,
        description: "Your message has been sent to your partner.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting message:", error);
      toast({
        title: "Error",
        description: "Failed to submit message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodOptions = messageType === 'grievance' ? [
    { value: "frustrated", label: "😤 Frustrated", color: "text-red-500" },
    { value: "sad", label: "😢 Sad", color: "text-blue-500" },
    { value: "confused", label: "😕 Confused", color: "text-yellow-500" },
    { value: "angry", label: "😠 Angry", color: "text-red-600" },
    { value: "disappointed", label: "😞 Disappointed", color: "text-gray-500" },
    { value: "hopeful", label: "🤞 Hopeful", color: "text-green-500" }
  ] : [
    { value: "happy", label: "😊 Happy", color: "text-yellow-500" },
    { value: "excited", label: "🤗 Excited", color: "text-orange-500" },
    { value: "grateful", label: "🙏 Grateful", color: "text-green-500" },
    { value: "loved", label: "🥰 Loved", color: "text-pink-500" },
    { value: "peaceful", label: "😌 Peaceful", color: "text-blue-500" },
    { value: "nostalgic", label: "🌅 Nostalgic", color: "text-purple-500" }
  ];

  const IconComponent = currentMessageType.icon;

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

        <Card className={`bg-white/80 backdrop-blur-sm shadow-xl ${currentMessageType.color}`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold flex items-center ${currentMessageType.headerColor}`}>
              <IconComponent className="mr-2" size={24} />
              Send a {currentMessageType.label.split(' ')[1]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  {messageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                type="text"
                placeholder={
                  messageType === 'grievance' ? "A brief summary of your concern" :
                  messageType === 'compliment' ? "What you want to compliment about" :
                  messageType === 'memory' ? "Name this special memory" :
                  "How you're feeling today"
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {messageType === 'grievance' ? 'Describe the Issue' :
                 messageType === 'compliment' ? 'Your Compliment' :
                 messageType === 'memory' ? 'Tell the Story' :
                 'Express Your Feelings'}
              </label>
              <Textarea
                placeholder={
                  messageType === 'grievance' ? "Explain the situation, how it makes you feel, and what you need." :
                  messageType === 'compliment' ? "Share what you appreciate and admire about your partner." :
                  messageType === 'memory' ? "Describe this beautiful memory you both share." :
                  "Share what's in your heart and mind right now."
                }
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {messageType === 'grievance' && (
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
              )}

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
              className={`w-full ${currentMessageType.buttonColor} text-white`}
            >
              {isSubmitting ? (
                <>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={16} />
                  Send {currentMessageType.label.split(' ')[1]}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
