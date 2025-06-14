import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, LogOut, Edit, MessageCircle, Eye, CheckCircle, HeartCrack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { GrievanceResponse } from "./GrievanceResponse";
import { GrievanceView } from "./GrievanceView";
import { BrokenHeartDialog } from "./BrokenHeartDialog";
import { BrokenHeartRequestDialog } from "./BrokenHeartRequestDialog";
import { ClearAllConfirmationDialog } from "./ClearAllConfirmationDialog";
import { PartnerResponseDialog } from "./PartnerResponseDialog";

interface UserData {
  uid: string;
  email: string;
  nickname: string;
  partnerEmail: string;
  userIcon: string;
}

interface UserDashboardProps {
  userData: UserData;
  onLogout: () => void;
  onSubmitGrievance: () => void;
  onEditProfile: () => void;
}

interface Grievance {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  timestamp: any;
  senderNickname: string;
  senderEmail: string;
  receiverEmail: string;
  mood?: string;
  responses: any[];
  type?: string;
}

export const UserDashboard = ({ userData, onLogout, onSubmitGrievance, onEditProfile }: UserDashboardProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [sentGrievances, setSentGrievances] = useState<Grievance[]>([]);
  const [receivedGrievances, setReceivedGrievances] = useState<Grievance[]>([]);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [viewMode, setViewMode] = useState<'respond' | 'view'>('respond');
  const [showBrokenHeartDialog, setShowBrokenHeartDialog] = useState(false);
  const [brokenHeartRequest, setBrokenHeartRequest] = useState<any>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [partnerResponse, setPartnerResponse] = useState<any>(null);

  useEffect(() => {
    if (!currentUser || !userData || !currentUser.email) {
      console.log("Missing required data:", { 
        currentUser: !!currentUser, 
        userData: !!userData, 
        currentUserEmail: currentUser?.email 
      });
      return;
    }

    console.log("Setting up grievance listeners for:");
    console.log("Current user email:", currentUser.email);
    console.log("Current user UID:", currentUser.uid);
    console.log("Partner email:", userData.partnerEmail);

    // Simplified query for sent grievances (no compound index needed)
    const sentQuery = query(
      collection(db, 'grievances'),
      where('senderEmail', '==', currentUser.email)
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      console.log("Sent grievances snapshot received:", snapshot.docs.length, "documents");
      const allGrievances = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Sent grievance data:", data);
        return {
          id: doc.id,
          ...data
        };
      }) as Grievance[];
      
      // Filter out broken heart requests and partner responses
      const grievances = allGrievances.filter(g => 
        g.type !== 'broken_heart_request' && g.type !== 'partner_response'
      );
      
      const sortedGrievances = grievances.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      console.log("Setting sent grievances:", sortedGrievances.length);
      setSentGrievances(sortedGrievances);
    }, (error) => {
      console.error("Error loading sent grievances:", error);
      toast({
        title: "Error",
        description: "Failed to load sent grievances.",
        variant: "destructive"
      });
    });

    // Simplified query for received grievances (no compound index needed)
    const receivedQuery = query(
      collection(db, 'grievances'),
      where('receiverEmail', '==', currentUser.email)
    );

    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      console.log("Received grievances snapshot received:", snapshot.docs.length, "documents");
      const allGrievances = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Received grievance data:", data);
        return {
          id: doc.id,
          ...data
        };
      }) as Grievance[];
      
      // Filter out broken heart requests and partner responses, keep regular grievances
      const grievances = allGrievances.filter(g => 
        g.type !== 'broken_heart_request' && g.type !== 'partner_response'
      );
      
      // Separate broken heart requests for special handling
      const brokenHeartRequests = allGrievances.filter(g => g.type === 'broken_heart_request');
      if (brokenHeartRequests.length > 0) {
        setBrokenHeartRequest(brokenHeartRequests[0]);
      } else {
        setBrokenHeartRequest(null);
      }
      
      const sortedGrievances = grievances.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      console.log("Setting received grievances:", sortedGrievances.length);
      setReceivedGrievances(sortedGrievances);
    }, (error) => {
      console.error("Error loading received grievances:", error);
      toast({
        title: "Error",
        description: "Failed to load received grievances.",
        variant: "destructive"
      });
    });

    // Listen for partner responses to my clear all requests
    const partnerResponseQuery = query(
      collection(db, 'grievances'),
      where('senderEmail', '==', currentUser.email),
      where('type', '==', 'partner_response')
    );

    const unsubscribePartnerResponse = onSnapshot(partnerResponseQuery, (snapshot) => {
      if (!snapshot.empty) {
        const response = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
        setPartnerResponse(response);
      } else {
        setPartnerResponse(null);
      }
    });

    const loadPartnerData = async () => {
      if (userData.partnerEmail) {
        try {
          console.log("Loading partner data for:", userData.partnerEmail);
          const partnerQuery = query(
            collection(db, 'users'),
            where('email', '==', userData.partnerEmail)
          );
          const partnerSnapshot = await getDocs(partnerQuery);
          if (!partnerSnapshot.empty) {
            const partner = partnerSnapshot.docs[0].data();
            console.log("Found partner data:", partner);
            setPartnerData(partner);
          } else {
            console.log("No partner found with email:", userData.partnerEmail);
          }
        } catch (error) {
          console.error("Error loading partner data:", error);
        }
      }
    };

    loadPartnerData();

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
      unsubscribePartnerResponse();
    };
  }, [currentUser, userData, toast]);

  const handleMarkResolved = async (grievanceId: string) => {
    try {
      await updateDoc(doc(db, 'grievances', grievanceId), {
        status: 'resolved'
      });

      toast({
        title: "Grievance Resolved! 🎉",
        description: "Thank you for working together to solve this issue.",
      });
    } catch (error) {
      console.error("Error updating grievance status:", error);
      toast({
        title: "Error",
        description: "Failed to update grievance status.",
        variant: "destructive"
      });
    }
  };

  const handleViewGrievance = (grievance: Grievance, mode: 'respond' | 'view') => {
    setSelectedGrievance(grievance);
    setViewMode(mode);
  };

  const handleBackToDashboard = () => {
    setSelectedGrievance(null);
  };

  const handleBrokenHeartRequest = async (reason: string) => {
    try {
      const requestData = {
        title: "💔 Clear All Grievances Request",
        description: reason,
        priority: "high",
        status: "pending",
        timestamp: serverTimestamp(),
        senderNickname: userData.nickname || '',
        senderEmail: currentUser?.email || '',
        receiverEmail: userData.partnerEmail || '',
        senderId: currentUser?.uid || '',
        receiverId: '',
        mood: "hopeful",
        responses: [],
        type: "broken_heart_request"
      };

      console.log("Sending broken heart request as grievance:", requestData);

      await addDoc(collection(db, 'grievances'), requestData);

      toast({
        title: "Clear All Request Sent 💔",
        description: "Your partner will receive your request to start fresh together.",
      });
      
      setShowBrokenHeartDialog(false);
    } catch (error) {
      console.error("Error sending broken heart request:", error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      // Delete all grievances for both users
      const grievancesQuery1 = query(
        collection(db, 'grievances'),
        where('senderEmail', '==', currentUser?.email)
      );
      const grievancesQuery2 = query(
        collection(db, 'grievances'),
        where('receiverEmail', '==', currentUser?.email)
      );

      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(grievancesQuery1),
        getDocs(grievancesQuery2)
      ]);

      const deletePromises = [
        ...snapshot1.docs.map(doc => deleteDoc(doc.ref)),
        ...snapshot2.docs.map(doc => deleteDoc(doc.ref))
      ];

      await Promise.all(deletePromises);

      toast({
        title: "All Grievances Cleared! 💕",
        description: "You and your partner are starting fresh together.",
      });

      setShowConfirmationDialog(false);
    } catch (error) {
      console.error("Error clearing grievances:", error);
      toast({
        title: "Error",
        description: "Failed to clear grievances. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (selectedGrievance) {
    if (viewMode === 'respond') {
      return (
        <GrievanceResponse 
          grievance={selectedGrievance} 
          onBack={handleBackToDashboard} 
        />
      );
    } else {
      return (
        <GrievanceView 
          grievance={selectedGrievance} 
          onBack={handleBackToDashboard}
          onMarkResolved={handleMarkResolved}
          canMarkResolved={selectedGrievance.senderEmail === currentUser?.email}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Welcome {userData.nickname}!</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowBrokenHeartDialog(true)}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <HeartCrack className="mr-2" size={16} />
              Clear All
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="text-pink-600 border-pink-300 hover:bg-pink-50"
            >
              <LogOut className="mr-2" size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center border-4 border-red-200 text-3xl">
                  {userData.userIcon || "❤️"}
                </div>
                <Heart className="text-pink-500" size={24} />
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center border-4 border-gray-200 text-3xl">
                  {partnerData?.userIcon || "💜"}
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
                  <p className="text-sm text-gray-600">{partnerData?.nickname || userData.partnerEmail}</p>
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
                Grievances You've Sent ({sentGrievances.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentGrievances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No grievances sent yet.</p>
              ) : (
                <div className="space-y-2">
                  {sentGrievances.slice(0, 3).map((grievance, index) => (
                    <div 
                      key={grievance.id} 
                      className={`p-3 rounded-lg border transition-colors ${
                        index === 0 
                          ? 'bg-pink-100 border-pink-400 ring-2 ring-pink-300' 
                          : 'bg-pink-50 border-pink-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{grievance.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{grievance.status}</p>
                          <p className="text-xs text-gray-500">To: {partnerData?.nickname || grievance.receiverEmail}</p>
                          {grievance.mood && (
                            <p className="text-xs text-purple-600 font-medium">{grievance.mood}</p>
                          )}
                          {grievance.responses && grievance.responses.length > 0 && (
                            <p className="text-xs text-green-600 font-medium">{grievance.responses.length} response(s)</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewGrievance(grievance, 'view')}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            <Eye className="mr-1" size={14} />
                            View
                          </Button>
                          {grievance.status !== 'resolved' && grievance.responses && grievance.responses.length > 0 && (
                            <Button
                              onClick={() => handleMarkResolved(grievance.id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="mr-1" size={14} />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
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
                Grievances You've Received ({receivedGrievances.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receivedGrievances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No grievances received yet.</p>
              ) : (
                <div className="space-y-2">
                  {receivedGrievances.slice(0, 3).map((grievance, index) => (
                    <div 
                      key={grievance.id} 
                      className={`p-3 rounded-lg border transition-colors ${
                        index === 0 
                          ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-300' 
                          : 'bg-purple-50 border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{grievance.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{grievance.status}</p>
                          <p className="text-xs text-gray-500">From: {grievance.senderNickname}</p>
                          {grievance.mood && (
                            <p className="text-xs text-purple-600 font-medium">{grievance.mood}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleViewGrievance(grievance, 'respond')}
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          <MessageCircle className="mr-1" size={14} />
                          Respond
                        </Button>
                      </div>
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

        <BrokenHeartDialog 
          isOpen={showBrokenHeartDialog}
          onClose={() => setShowBrokenHeartDialog(false)}
          onSubmit={handleBrokenHeartRequest}
        />

        {brokenHeartRequest && (
          <BrokenHeartRequestDialog
            request={brokenHeartRequest}
            onClose={() => setBrokenHeartRequest(null)}
            currentUserEmail={currentUser?.email || ''}
          />
        )}

        {showConfirmationDialog && (
          <ClearAllConfirmationDialog
            onConfirm={handleConfirmClearAll}
            onCancel={() => setShowConfirmationDialog(false)}
          />
        )}

        {partnerResponse && (
          <PartnerResponseDialog
            response={partnerResponse}
            onClose={() => setPartnerResponse(null)}
            onProceed={() => {
              setPartnerResponse(null);
              setShowConfirmationDialog(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
