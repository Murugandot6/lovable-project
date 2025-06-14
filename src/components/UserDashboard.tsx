
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, LogOut, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  email: string;
  nickname: string;
  partnerEmail: string;
  isLoggedIn: boolean;
}

interface UserDashboardProps {
  userData: UserData;
  onLogout: () => void;
  onSubmitGrievance: () => void;
  onEditProfile: () => void;
}

export const UserDashboard = ({ userData, onLogout, onSubmitGrievance, onEditProfile }: UserDashboardProps) => {
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('grievances');
    if (stored) {
      setGrievances(JSON.parse(stored));
    }
  }, []);

  const sentGrievances = grievances.filter(g => g.partnerName1 === userData.nickname);
  const receivedGrievances = grievances.filter(g => g.partnerName2 === userData.nickname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Welcome!</h1>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="text-pink-600 border-pink-300 hover:bg-pink-50"
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </div>

        {/* User Profile Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center border-4 border-red-200">
                  <Heart className="text-red-500" size={32} />
                </div>
                <Heart className="text-pink-500" size={24} />
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center border-4 border-gray-200">
                  <User className="text-gray-500" size={32} />
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <p className="text-red-500 font-semibold">You</p>
                  <p className="text-sm text-gray-600">{userData.nickname}</p>
                </div>
                <div className="text-center">
                  <p className="text-pink-500 font-semibold">Partner</p>
                  <p className="text-sm text-gray-600">{userData.partnerEmail}</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={onEditProfile}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold mb-4"
            >
              <Edit className="mr-2" size={16} />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Grievances Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-pink-600 flex items-center">
                <span className="mr-2">📤</span>
                Grievances You've Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentGrievances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Fetching your grievances...</p>
              ) : (
                <div className="space-y-2">
                  {sentGrievances.slice(0, 3).map((grievance) => (
                    <div key={grievance.id} className="p-3 bg-pink-50 rounded-lg">
                      <p className="font-medium text-gray-800">{grievance.concernTitle}</p>
                      <p className="text-sm text-gray-600">{grievance.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-600 flex items-center">
                <span className="mr-2">📥</span>
                Grievances You've Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receivedGrievances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Fetching your grievances...</p>
              ) : (
                <div className="space-y-2">
                  {receivedGrievances.slice(0, 3).map((grievance) => (
                    <div key={grievance.id} className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-gray-800">{grievance.concernTitle}</p>
                      <p className="text-sm text-gray-600">{grievance.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit New Grievance Button */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardContent className="py-6">
            <Button 
              onClick={onSubmitGrievance}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-semibold text-lg"
            >
              📝 Submit a New Grievance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
