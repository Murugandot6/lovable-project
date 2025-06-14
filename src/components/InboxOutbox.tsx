
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, Send, Heart, MessageSquareHeart, Star, Smile, Eye, MessageCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface InboxOutboxProps {
  userData: any;
  onBack: () => void;
  onViewMessage: (message: any, mode: 'respond' | 'view') => void;
}

interface Message {
  id: string;
  title: string;
  description: string;
  priority?: string;
  status: string;
  timestamp: any;
  senderNickname: string;
  senderEmail: string;
  receiverEmail: string;
  mood?: string;
  responses?: any[];
  messageType?: string;
  type?: string;
}

const messageTypeConfig = {
  grievance: { 
    color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200", 
    icon: Heart, 
    bgClass: "bg-red-100 dark:bg-red-900/50",
    textClass: "text-red-600 dark:text-red-400",
    buttonClass: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
  },
  compliment: { 
    color: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200", 
    icon: MessageSquareHeart, 
    bgClass: "bg-pink-100 dark:bg-pink-900/50",
    textClass: "text-pink-600 dark:text-pink-400",
    buttonClass: "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
  },
  memory: { 
    color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200", 
    icon: Star, 
    bgClass: "bg-yellow-100 dark:bg-yellow-900/50",
    textClass: "text-yellow-600 dark:text-yellow-400",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
  },
  feeling: { 
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200", 
    icon: Smile, 
    bgClass: "bg-purple-100 dark:bg-purple-900/50",
    textClass: "text-purple-600 dark:text-purple-400",
    buttonClass: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
  }
};

export const InboxOutbox = ({ userData, onBack, onViewMessage }: InboxOutboxProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("inbox");

  useEffect(() => {
    if (!currentUser || !userData || !currentUser.email) {
      return;
    }

    // Query for sent messages (outbox)
    const sentQuery = query(
      collection(db, 'grievances'),
      where('senderEmail', '==', currentUser.email)
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message)).filter(msg => msg.type !== 'broken_heart_request' && msg.type !== 'partner_response');
      
      const sortedMessages = messages.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      setSentMessages(sortedMessages);
    });

    // Query for received messages (inbox)
    const receivedQuery = query(
      collection(db, 'grievances'),
      where('receiverEmail', '==', currentUser.email)
    );

    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message)).filter(msg => msg.type !== 'broken_heart_request' && msg.type !== 'partner_response');
      
      const sortedMessages = messages.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      setReceivedMessages(sortedMessages);
    });

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [currentUser, userData]);

  const handleMarkResolved = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'grievances', messageId), {
        status: 'resolved'
      });

      toast({
        title: "Message Resolved! 🎉",
        description: "Thank you for working together to solve this issue.",
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive"
      });
    }
  };

  const renderMessageCard = (message: Message, index: number, isInbox: boolean) => {
    const messageType = message.messageType || 'grievance';
    const config = messageTypeConfig[messageType as keyof typeof messageTypeConfig] || messageTypeConfig.grievance;
    const IconComponent = config.icon;
    const isLatest = index === 0;

    return (
      <div 
        key={message.id} 
        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
          isLatest 
            ? `${config.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${config.textClass.replace('text-', 'ring-')} shadow-lg` 
            : `${config.color.replace('50', '25').replace('950/30', '950/10')} hover:${config.color}`
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${config.bgClass}`}>
              <IconComponent className={config.textClass} size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{message.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={`text-xs ${config.color}`}>
                  {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
                </Badge>
                {isLatest && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    Latest ✨
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{message.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="capitalize">{message.status || 'sent'}</span>
            {message.mood && (
              <span className="text-purple-600 dark:text-purple-400 font-medium">{message.mood}</span>
            )}
            {message.responses && message.responses.length > 0 && (
              <span className="text-green-600 dark:text-green-400 font-medium">{message.responses.length} response(s)</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => onViewMessage(message, isInbox ? 'respond' : 'view')}
              size="sm"
              className={`${config.buttonClass} text-white`}
            >
              {isInbox ? (
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
            
            {!isInbox && message.messageType === 'grievance' && message.status !== 'resolved' && message.responses && message.responses.length > 0 && (
              <Button
                onClick={() => handleMarkResolved(message.id)}
                size="sm"
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
              >
                <CheckCircle className="mr-1" size={14} />
                Resolve
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/50 dark:to-blue-900/50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-pink-200 dark:border-pink-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center">
              <MessageSquareHeart className="mr-2" size={24} />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="inbox" className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">
                  <Inbox className="mr-2" size={16} />
                  Inbox ({receivedMessages.length})
                </TabsTrigger>
                <TabsTrigger value="outbox" className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">
                  <Send className="mr-2" size={16} />
                  Outbox ({sentMessages.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inbox" className="mt-6">
                {receivedMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Inbox className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">No messages received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedMessages.map((message, index) => 
                      renderMessageCard(message, index, true)
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="outbox" className="mt-6">
                {sentMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">No messages sent yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentMessages.map((message, index) => 
                      renderMessageCard(message, index, false)
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
