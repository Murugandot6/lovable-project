
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, assignUserIcon } from '@/lib/firebase';

interface AuthFormProps {
  mode: 'login' | 'register';
  onBack: () => void;
  onAuthSuccess: () => void;
}

export const AuthForm = ({ mode, onBack, onAuthSuccess }: AuthFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    partnerEmail: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, formData.email.toLowerCase(), formData.password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: formData.email.toLowerCase(),
          nickname: formData.nickname,
          partnerEmail: formData.partnerEmail.toLowerCase(),
          userIcon: assignUserIcon(cred.user.uid),
          createdAt: new Date()
        });
        toast({
          title: "Registration successful! 🎉",
          description: "Welcome to LoveResolve!",
        });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({
          title: "Welcome back! 💕",
          description: "You're now logged in.",
        });
      }
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="container mx-auto px-4 max-w-sm sm:max-w-md w-full">
        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <div className="mx-auto bg-pink-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 border-pink-200">
              <Heart className="text-red-500" size={24} />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-pink-600">
              {mode === 'login' ? '👋 Welcome Back!' : '💕 Join LoveResolve'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 flex items-center text-sm sm:text-base">
                  <span className="mr-2">📧</span>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                  className="border-pink-200 focus:border-pink-400 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 flex items-center text-sm sm:text-base">
                  <span className="mr-2">🔒</span>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Your password"
                  required
                  className="border-pink-200 focus:border-pink-400 text-sm sm:text-base"
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-gray-700 flex items-center text-sm sm:text-base">
                      <span className="mr-2">👤</span>
                      Nickname
                    </Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                      placeholder="Your Nickname"
                      required
                      className="border-pink-200 focus:border-pink-400 text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerEmail" className="text-gray-700 flex items-center text-sm sm:text-base">
                      <span className="mr-2">💌</span>
                      Partner's Email
                    </Label>
                    <Input
                      id="partnerEmail"
                      type="email"
                      value={formData.partnerEmail}
                      onChange={(e) => setFormData({...formData, partnerEmail: e.target.value})}
                      placeholder="partner@example.com"
                      required
                      className="border-pink-200 focus:border-pink-400 text-sm sm:text-base"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                {loading ? "⏳ Please wait..." : (mode === 'login' ? "🚪 Sign In" : "🎉 Create Account")}
              </Button>
            </form>

            <div className="text-center mt-4 sm:mt-6">
              <button 
                onClick={onBack}
                className="text-pink-600 hover:text-pink-700 font-medium flex items-center justify-center mx-auto text-sm sm:text-base"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
