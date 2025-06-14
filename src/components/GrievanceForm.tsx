
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GrievanceFormProps {
  onBack: () => void;
  onSubmitted: () => void;
}

export const GrievanceForm = ({ onBack, onSubmitted }: GrievanceFormProps) => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    partnerName1: "",
    partnerName2: "",
    relationshipDuration: "",
    concernTitle: "",
    description: "",
    priority: "",
    desiredOutcome: ""
  });

  useEffect(() => {
    // Get logged-in user data
    const stored = localStorage.getItem('userData');
    if (stored) {
      const user = JSON.parse(stored);
      setUserData(user);
      setFormData(prev => ({
        ...prev,
        partnerName1: user.nickname || "",
        partnerName2: user.partnerEmail || ""
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage for demo purposes
    const existingGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
    const newGrievance = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      actions: [],
      submittedBy: userData?.email || 'anonymous'
    };
    
    existingGrievances.push(newGrievance);
    localStorage.setItem('grievances', JSON.stringify(existingGrievances));
    
    toast({
      title: "Concern Submitted Successfully! 💕",
      description: "Your concern has been recorded. Check the dashboard to track progress.",
    });
    
    // Navigate to thank you page
    onSubmitted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-pink-600" size={24} />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Share Your Concern
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Express your feelings in a safe space designed for understanding and growth
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner1" className="text-gray-700">Your Name</Label>
                  <Input
                    id="partner1"
                    value={formData.partnerName1}
                    onChange={(e) => setFormData({...formData, partnerName1: e.target.value})}
                    placeholder="Your name"
                    required
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner2" className="text-gray-700">Partner's Name/Email</Label>
                  <Input
                    id="partner2"
                    value={formData.partnerName2}
                    onChange={(e) => setFormData({...formData, partnerName2: e.target.value})}
                    placeholder="Partner's name or email"
                    required
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-gray-700">Relationship Duration</Label>
                <Input
                  id="duration"
                  value={formData.relationshipDuration}
                  onChange={(e) => setFormData({...formData, relationshipDuration: e.target.value})}
                  placeholder="e.g., 2 years, 6 months"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Concern Title</Label>
                <Input
                  id="title"
                  value={formData.concernTitle}
                  onChange={(e) => setFormData({...formData, concernTitle: e.target.value})}
                  placeholder="Brief title for your concern"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-700">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait</SelectItem>
                    <SelectItem value="medium">Medium - Should address soon</SelectItem>
                    <SelectItem value="high">High - Needs immediate attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your concern in detail. What happened? How did it make you feel? What would you like to see change?"
                  required
                  rows={5}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome" className="text-gray-700">Desired Outcome</Label>
                <Textarea
                  id="outcome"
                  value={formData.desiredOutcome}
                  onChange={(e) => setFormData({...formData, desiredOutcome: e.target.value})}
                  placeholder="What would you like to see happen? How can this be resolved?"
                  required
                  rows={3}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="mr-2" size={20} />
                Submit Concern
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
