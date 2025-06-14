
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  email: string;
  nickname: string;
  partnerEmail: string;
  isLoggedIn: boolean;
}

interface ProfileEditProps {
  userData: UserData;
  onBack: () => void;
  onSave: (updatedData: UserData) => void;
}

export const ProfileEdit = ({ userData, onBack, onSave }: ProfileEditProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nickname: userData.nickname,
    partnerEmail: userData.partnerEmail
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUserData = {
      ...userData,
      nickname: formData.nickname,
      partnerEmail: formData.partnerEmail
    };
    
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    toast({
      title: "Profile Updated! ✨",
      description: "Your profile changes have been saved.",
    });
    
    onSave(updatedUserData);
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
                  Nickname
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
