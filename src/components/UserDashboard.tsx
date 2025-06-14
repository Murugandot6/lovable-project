
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, LogOut, Plus, User, FileText, Eye } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GrievanceView } from "@/components/GrievanceView";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Grievance {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'open' | 'inProgress' | 'resolved' | 'closed';
  resolutionDetails?: string;
  priority: string;
  timestamp: any;
  senderNickname: string;
  senderEmail: string;
  receiverEmail: string;
  mood?: string;
  responses?: Array<{
    id: string;
    message: string;
    responderId: string;
    responderNickname: string;
    timestamp: any;
  }>;
}

interface UserDashboardProps {
  userData: {
    uid: string;
    email: string;
    nickname: string;
    partnerEmail: string;
  } | null;
  onLogout: () => void;
  onSubmitGrievance: () => void;
  onEditProfile: () => void;
  onViewAllGrievances: () => void;
}

export const UserDashboard = ({ userData, onLogout, onSubmitGrievance, onEditProfile, onViewAllGrievances }: UserDashboardProps) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isGrievanceViewOpen, setIsGrievanceViewOpen] = useState(false);

  useEffect(() => {
    if (userData?.email) {
      const q = query(
        collection(db, "grievances"),
        where("submittedBy", "==", userData.email),
        orderBy("submittedAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const grievancesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Grievance[];
        setGrievances(grievancesData);
      });

      return () => unsubscribe();
    }
  }, [userData?.email]);

  const handleViewGrievance = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setIsGrievanceViewOpen(true);
  };

  const handleCloseGrievanceView = () => {
    setIsGrievanceViewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="text-pink-500 mr-2" size={28} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {userData?.nickname || 'User'}!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={onEditProfile}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <User size={16} />
              Edit Profile
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12">
        {/* Dashboard Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Grievances</h2>
          <div className="flex gap-2">
            <Button
              onClick={onSubmitGrievance}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Submit New
            </Button>
             <Button
              onClick={onViewAllGrievances}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              View All Grievances
            </Button>
          </div>
        </div>

        {/* Grievance List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grievances.map((grievance) => (
            <Card key={grievance.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{grievance.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {grievance.description.substring(0, 100)}...
                </CardDescription>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    Submitted on: {new Date(grievance.submittedAt).toLocaleDateString()}
                  </span>
                  <Button 
                    onClick={() => handleViewGrievance(grievance)}
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    <Eye size={16} className="mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grievance View Modal */}
      {isGrievanceViewOpen && selectedGrievance && (
        <GrievanceView 
          grievance={selectedGrievance} 
          onClose={handleCloseGrievanceView}
          onBack={handleCloseGrievanceView}
          onMarkResolved={() => {}}
          canMarkResolved={false}
        />
      )}
    </div>
  );
};
