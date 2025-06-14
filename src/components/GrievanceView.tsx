
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, CheckCircle } from "lucide-react";

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
  responses?: Array<{
    id: string;
    message: string;
    responderId: string;
    responderNickname: string;
    timestamp: any;
  }>;
}

interface GrievanceViewProps {
  grievance: Grievance;
  onBack: () => void;
  onMarkResolved: (grievanceId: string) => void;
  canMarkResolved: boolean;
}

export const GrievanceView = ({ grievance, onBack, onMarkResolved, canMarkResolved }: GrievanceViewProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'responded': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        {/* Grievance Details */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  {grievance.title}
                </CardTitle>
                <div className="flex gap-2 mb-4">
                  <Badge className={getPriorityColor(grievance.priority)}>
                    {grievance.priority} priority
                  </Badge>
                  <Badge className={getStatusColor(grievance.status)}>
                    {grievance.status}
                  </Badge>
                  {grievance.mood && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {grievance.mood}
                    </Badge>
                  )}
                </div>
              </div>
              <Heart className="text-pink-500" size={24} />
            </div>
            <p className="text-gray-600">
              From: <strong>{grievance.senderNickname}</strong> • 
              {grievance.timestamp && new Date(grievance.timestamp.toDate()).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{grievance.description}</p>
              </div>
              
              {canMarkResolved && grievance.status !== 'resolved' && grievance.responses && grievance.responses.length > 0 && (
                <div className="flex justify-end">
                  <Button 
                    onClick={() => onMarkResolved(grievance.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responses */}
        {grievance.responses && grievance.responses.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-600">
                Responses ({grievance.responses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grievance.responses.map((response) => (
                  <div key={response.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-purple-800">{response.responderNickname}</span>
                      <span className="text-xs text-gray-500">
                        {response.timestamp && new Date(response.timestamp.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {grievance.responses && grievance.responses.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No responses yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
