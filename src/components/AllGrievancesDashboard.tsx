
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Eye, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { GrievanceResponse } from "./GrievanceResponse";
import { GrievanceView } from "./GrievanceView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface AllGrievancesDashboardProps {
  onBack: () => void;
}

export const AllGrievancesDashboard = ({ onBack }: AllGrievancesDashboardProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [allGrievances, setAllGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [viewMode, setViewMode] = useState<'respond' | 'view'>('view');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.email) return;

    console.log("Loading all grievances for user:", currentUser.email);

    // Query for all grievances where user is either sender or receiver
    const grievancesQuery = query(
      collection(db, 'grievances'),
      or(
        where('senderEmail', '==', currentUser.email),
        where('receiverEmail', '==', currentUser.email)
      )
    );

    const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
      console.log("All grievances snapshot received:", snapshot.docs.length, "documents");
      const grievances = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      }) as Grievance[];
      
      // Filter out broken heart requests and partner responses
      const regularGrievances = grievances.filter(g => 
        g.type !== 'broken_heart_request' && g.type !== 'partner_response'
      );
      
      const sortedGrievances = regularGrievances.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      console.log("Setting all grievances:", sortedGrievances.length);
      setAllGrievances(sortedGrievances);
      setLoading(false);
    }, (error) => {
      console.error("Error loading all grievances:", error);
      toast({
        title: "Error",
        description: "Failed to load grievances.",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="text-green-500" size={16} />;
      case 'in-progress': return <Clock className="text-yellow-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getDirection = (grievance: Grievance) => {
    return grievance.senderEmail === currentUser?.email ? 'sent' : 'received';
  };

  const handleViewGrievance = (grievance: Grievance) => {
    const direction = getDirection(grievance);
    setSelectedGrievance(grievance);
    setViewMode(direction === 'received' ? 'respond' : 'view');
  };

  const handleBackToDashboard = () => {
    setSelectedGrievance(null);
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
          onMarkResolved={() => {}}
          canMarkResolved={selectedGrievance.senderEmail === currentUser?.email}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-500 mr-2" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              All Grievances Dashboard
            </h1>
          </div>
          <p className="text-gray-600">Complete overview of all your grievances</p>
        </div>

        {loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading grievances...</p>
            </CardContent>
          </Card>
        ) : allGrievances.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <CardContent className="py-12 text-center">
              <Heart className="text-pink-300 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No grievances yet</h3>
              <p className="text-gray-500 mb-6">Start by submitting your first grievance to begin your journey toward better communication.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
                <span>All Grievances ({allGrievances.length})</span>
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Sent: {allGrievances.filter(g => getDirection(g) === 'sent').length}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Received: {allGrievances.filter(g => getDirection(g) === 'received').length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Direction</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allGrievances.map((grievance) => {
                      const direction = getDirection(grievance);
                      return (
                        <TableRow key={grievance.id}>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={direction === 'sent' 
                                ? 'bg-pink-50 text-pink-700 border-pink-200' 
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                              }
                            >
                              {direction === 'sent' ? '📤 Sent' : '📥 Received'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate" title={grievance.title}>
                              {grievance.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {direction === 'sent' ? 'To: ' : 'From: '}
                              {direction === 'sent' ? grievance.receiverEmail : grievance.senderNickname}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(grievance.priority)}>
                              {grievance.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(grievance.status)}
                              <span className="capitalize text-sm">{grievance.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {grievance.mood && (
                              <span className="text-sm text-purple-600 font-medium">
                                {grievance.mood}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {grievance.responses?.length || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {grievance.timestamp?.toDate ? 
                              grievance.timestamp.toDate().toLocaleDateString() : 
                              'Unknown'
                            }
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleViewGrievance(grievance)}
                              size="sm"
                              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                            >
                              {direction === 'received' ? (
                                <>
                                  <MessageCircle className="mr-1" size={14} />
                                  Respond
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-1" size={14} />
                                  View
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
