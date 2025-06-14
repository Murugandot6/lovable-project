
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  uid: string;
  email: string;
  nickname: string;
  partnerEmail: string;
  partnerNickname?: string;
  userIcon: string;
}

interface ProfileEditProps {
  userData: UserData | null;
  onBack: () => void;
  onSave: () => void;
}

export const ProfileEdit = ({ userData, onBack, onSave }: ProfileEditProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    nickname: userData?.nickname || "",
    partnerEmail: userData?.partnerEmail || "",
    partnerNickname: userData?.partnerNickname || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        nickname: formData.nickname,
        partnerEmail: formData.partnerEmail,
        partnerNickname: formData.partnerNickname
      });
      
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile changes have been saved.",
      });
      
      onSave();
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 border-pink-200">
              <Heart className="text-red-500" size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-pink-600">
              👤 Edit Your Profile
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-gray-700 flex items-center">
                  <span className="mr-2">👤</span>
                  Your Nickname
                </Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                  placeholder="Your Nickname"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerEmail" className="text-gray-700 flex items-center">
                  <span className="mr-2">💌</span>
                  Partner's Email
                </Label>
                <Input
                  id="partnerEmail"
                  type="email"
                  value={formData.partnerEmail}
                  onChange={(e) => setFormData({...formData, partnerEmail: e.target.value})}
                  placeholder="Your Partner's Email"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerNickname" className="text-gray-700 flex items-center">
                  <span className="mr-2">💜</span>
                  Partner's Nickname (Optional)
                </Label>
                <Input
                  id="partnerNickname"
                  value={formData.partnerNickname}
                  onChange={(e) => setFormData({...formData, partnerNickname: e.target.value})}
                  placeholder="What you call your partner"
                  className="border-pink-200 focus:border-pink-400"
                />
                <p className="text-xs text-gray-500">
                  This will be used until your partner registers
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                💾 Save Changes
              </Button>
            </form>

            <div className="text-center mt-6">
              <button 
                onClick={onBack}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
