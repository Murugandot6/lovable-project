
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: 'login' | 'register';
  onBack: () => void;
  onAuthSuccess: (userData: any) => void;
}

export const AuthForm = ({ mode, onBack, onAuthSuccess }: AuthFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    partnerEmail: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register') {
      // Save user data for demo purposes
      const userData = {
        email: formData.email,
        nickname: formData.nickname,
        partnerEmail: formData.partnerEmail,
        isLoggedIn: true
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast({
        title: "Registration Successful! 💕",
        description: "Welcome to your Grievance Portal!",
      });
      
      onAuthSuccess(userData);
    } else {
      // Login logic - check if user exists
      const existingUser = localStorage.getItem('userData');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (userData.email === formData.email) {
          toast({
            title: "Welcome Back! 💕",
            description: "Successfully logged in to your portal.",
          });
          onAuthSuccess(userData);
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "No Account Found",
          description: "Please register first.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Button>

        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-pink-600" size={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-pink-600">
              Grievance Portal 💕
            </CardTitle>
            {mode === 'login' ? (
              <p className="text-gray-600 mt-2">Welcome back to your portal</p>
            ) : (
              <p className="text-gray-600 mt-2">Create your grievance account</p>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Password"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-gray-700">👤 Nickname</Label>
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
                    <Label htmlFor="partnerEmail" className="text-gray-700">💌 Partner's Email</Label>
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
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                👤 {mode === 'login' ? 'Login' : 'Register'}
              </Button>
            </form>

            <div className="text-center mt-6">
              {mode === 'login' ? (
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => window.location.hash = 'register'}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Register here.
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => window.location.hash = 'login'}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Login here.
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
