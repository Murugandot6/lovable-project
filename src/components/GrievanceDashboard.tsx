
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Grievance {
  id: number;
  partnerName1: string;
  partnerName2: string;
  relationshipDuration: string;
  concernTitle: string;
  description: string;
  priority: string;
  desiredOutcome: string;
  status: string;
  submittedDate: string;
  actions: Action[];
}

interface Action {
  id: number;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  createdDate: string;
}

interface GrievanceDashboardProps {
  onBack: () => void;
}

export const GrievanceDashboard = ({ onBack }: GrievanceDashboardProps) => {
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState({
    description: "",
    assignedTo: "",
    dueDate: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem('grievances');
    if (stored) {
      setGrievances(JSON.parse(stored));
    }
  }, []);

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
      case 'completed': return <CheckCircle className="text-green-500" size={20} />;
      case 'in-progress': return <Clock className="text-yellow-500" size={20} />;
      default: return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const addAction = () => {
    if (!selectedGrievance || !newAction.description || !newAction.assignedTo || !newAction.dueDate) {
      toast({
        title: "Please fill all fields",
        description: "All action fields are required.",
        variant: "destructive"
      });
      return;
    }

    const action: Action = {
      id: Date.now(),
      ...newAction,
      status: 'pending',
      createdDate: new Date().toISOString()
    };

    const updatedGrievances = grievances.map(g => 
      g.id === selectedGrievance.id 
        ? { ...g, actions: [...g.actions, action], status: 'in-progress' }
        : g
    );

    setGrievances(updatedGrievances);
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    
    const updatedSelected = updatedGrievances.find(g => g.id === selectedGrievance.id);
    setSelectedGrievance(updatedSelected || null);
    
    setNewAction({ description: "", assignedTo: "", dueDate: "" });
    setShowAddAction(false);
    
    toast({
      title: "Action Added! 🎯",
      description: "New action step has been added to the grievance.",
    });
  };

  const updateActionStatus = (actionId: number, status: string) => {
    if (!selectedGrievance) return;

    const updatedGrievances = grievances.map(g => 
      g.id === selectedGrievance.id 
        ? { 
            ...g, 
            actions: g.actions.map(a => a.id === actionId ? { ...a, status } : a),
            status: status === 'completed' && g.actions.every(a => a.id === actionId || a.status === 'completed') 
              ? 'resolved' 
              : 'in-progress'
          }
        : g
    );

    setGrievances(updatedGrievances);
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    
    const updatedSelected = updatedGrievances.find(g => g.id === selectedGrievance.id);
    setSelectedGrievance(updatedSelected || null);
    
    toast({
      title: "Action Updated! ✨",
      description: `Action marked as ${status}.`,
    });
  };

  if (selectedGrievance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            onClick={() => setSelectedGrievance(null)}
            variant="ghost" 
            className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedGrievance.concernTitle}
                  </CardTitle>
                  <div className="flex gap-2 mb-4">
                    <Badge className={getPriorityColor(selectedGrievance.priority)}>
                      {selectedGrievance.priority} priority
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {selectedGrievance.status}
                    </Badge>
                  </div>
                </div>
                {getStatusIcon(selectedGrievance.status)}
              </div>
              <p className="text-gray-600">
                <strong>{selectedGrievance.partnerName1}</strong> & <strong>{selectedGrievance.partnerName2}</strong> • 
                Together for {selectedGrievance.relationshipDuration}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedGrievance.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Desired Outcome</h4>
                  <p className="text-gray-600">{selectedGrievance.desiredOutcome}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-gray-800">Action Plan</CardTitle>
                <Button 
                  onClick={() => setShowAddAction(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
                >
                  <Plus className="mr-2" size={16} />
                  Add Action
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddAction && (
                <Card className="mb-6 bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action Description</label>
                        <Textarea
                          value={newAction.description}
                          onChange={(e) => setNewAction({...newAction, description: e.target.value})}
                          placeholder="Describe what needs to be done..."
                          rows={3}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                          <Select value={newAction.assignedTo} onValueChange={(value) => setNewAction({...newAction, assignedTo: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Who will do this?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={selectedGrievance.partnerName1}>{selectedGrievance.partnerName1}</SelectItem>
                              <SelectItem value={selectedGrievance.partnerName2}>{selectedGrievance.partnerName2}</SelectItem>
                              <SelectItem value="both">Both Partners</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                          <Input
                            type="date"
                            value={newAction.dueDate}
                            onChange={(e) => setNewAction({...newAction, dueDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addAction} className="bg-purple-500 hover:bg-purple-600">
                          Add Action
                        </Button>
                        <Button onClick={() => setShowAddAction(false)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {selectedGrievance.actions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No actions yet. Add the first action to get started!</p>
                ) : (
                  selectedGrievance.actions.map((action) => (
                    <Card key={action.id} className="bg-white border-gray-200">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-2">{action.description}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span><strong>Assigned to:</strong> {action.assignedTo}</span>
                              <span><strong>Due:</strong> {new Date(action.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Select value={action.status} onValueChange={(value) => updateActionStatus(action.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-500 mr-2" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Relationship Dashboard
            </h1>
          </div>
          <p className="text-gray-600">Track your concerns and action plans</p>
        </div>

        {grievances.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <CardContent className="py-12 text-center">
              <Heart className="text-pink-300 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No concerns submitted yet</h3>
              <p className="text-gray-500 mb-6">Start by submitting your first concern to begin your journey toward better communication.</p>
              <Button 
                onClick={onBack}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6"
              >
                Submit Your First Concern
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grievances.map((grievance) => (
              <Card 
                key={grievance.id} 
                className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setSelecte دGrievance(grievance)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {grievance.concernTitle}
                    </CardTitle>
                    {getStatusIcon(grievance.status)}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(grievance.priority)}>
                      {grievance.priority}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {grievance.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {grievance.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    <p><strong>{grievance.partnerName1}</strong> & <strong>{grievance.partnerName2}</strong></p>
                    <p>Submitted: {new Date(grievance.submittedDate).toLocaleDateString()}</p>
                    <p>{grievance.actions.length} action{grievance.actions.length !== 1 ? 's' : ''} planned</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
