
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Send, Sparkles, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { GratitudeNote } from "@/types/relationship";

interface DailyGratitudeProps {
  userData: any;
  onBack: () => void;
}

export const DailyGratitude = ({ userData, onBack }: DailyGratitudeProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [gratitudeMessage, setGratitudeMessage] = useState("");
  const [mood, setMood] = useState("grateful");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentNotes, setRecentNotes] = useState<GratitudeNote[]>([]);

  const moodOptions = [
    { value: "grateful", label: "😊 Grateful", color: "text-green-500" },
    { value: "love", label: "💕 In Love", color: "text-pink-500" },
    { value: "appreciative", label: "🙏 Appreciative", color: "text-blue-500" },
    { value: "blessed", label: "✨ Blessed", color: "text-purple-500" },
    { value: "thankful", label: "🌟 Thankful", color: "text-yellow-500" }
  ];

  useEffect(() => {
    if (!currentUser?.email) return;

    const gratitudeQuery = query(
      collection(db, 'gratitude'),
      where('receiverEmail', '==', currentUser.email),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(gratitudeQuery, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GratitudeNote[];
      setRecentNotes(notes.slice(0, 5));
    });

    return unsubscribe;
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gratitudeMessage.trim()) {
      toast({
        title: "Please write something",
        description: "Share what you appreciate about your partner.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'gratitude'), {
        message: gratitudeMessage.trim(),
        senderEmail: currentUser?.email,
        receiverEmail: userData.partnerEmail,
        senderNickname: userData.nickname,
        timestamp: serverTimestamp(),
        mood: mood
      });

      toast({
        title: "Gratitude Sent! 💕",
        description: "Your appreciation has been shared with your partner.",
      });

      setGratitudeMessage("");
      setMood("grateful");
    } catch (error) {
      console.error("Error sending gratitude:", error);
      toast({
        title: "Error",
        description: "Failed to send gratitude. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-pink-200 dark:border-pink-700 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center">
              <Sparkles className="mr-2" size={24} />
              Daily Gratitude
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Share what you appreciate about your partner today
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What are you grateful for today?
                </label>
                <Textarea
                  placeholder="I appreciate how you..."
                  rows={4}
                  value={gratitudeMessage}
                  onChange={(e) => setGratitudeMessage(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Send Gratitude
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {recentNotes.length > 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center">
                <Heart className="mr-2" size={20} />
                Recent Gratitude from Your Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div key={note.id} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-gray-800 dark:text-gray-200 italic">"{note.message}"</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        From: {note.senderNickname}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(note.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
