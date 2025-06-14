
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageSquareHeart, Star, Smile, HeartCrack, User, LogOut, Edit, MessageCircle, Eye, CheckCircle, Inbox, Send, ThemeToggle } from "lucide-react";

interface DocumentationProps {
  onBack: () => void;
}

export const Documentation = ({ onBack }: DocumentationProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/50 dark:to-blue-900/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">LoveResolve Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Complete guide to features and functionality</p>
        </div>

        {/* Overview */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-pink-200 dark:border-pink-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-pink-600 dark:text-pink-400 flex items-center">
              <Heart className="mr-2" size={24} />
              Application Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              LoveResolve is a relationship communication platform designed to help couples express their feelings, resolve conflicts, and strengthen their bond through structured messaging. The application provides a safe space for partners to share grievances, compliments, memories, and feelings in an organized way.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Core Purpose</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Facilitate healthy communication between romantic partners through structured messaging and response systems.</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Target Users</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Couples who want to improve their communication and resolve relationship issues constructively.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication System */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Authentication & User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Registration</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Email & Password</li>
                  <li>• Personal Nickname</li>
                  <li>• Partner's Email</li>
                  <li>• Auto-assigned User Icon</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Login System</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Email/Password Authentication</li>
                  <li>• Firebase Auth Integration</li>
                  <li>• Persistent Sessions</li>
                  <li>• Auto-redirect to Dashboard</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Profile Management</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Edit Nickname</li>
                  <li>• Change Partner Email</li>
                  <li>• Custom Partner Nickname</li>
                  <li>• User Icon Selection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Types */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">Message Types & Color System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="mr-2 text-red-500" size={20} />
                  <h4 className="font-semibold text-red-700 dark:text-red-300">Grievances</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For expressing concerns, issues, or problems in the relationship.</p>
                <div className="text-xs text-red-600 dark:text-red-400">Color: Red theme with various shades</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MessageSquareHeart className="mr-2 text-pink-500" size={20} />
                  <h4 className="font-semibold text-pink-700 dark:text-pink-300">Compliments</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For sharing appreciation, praise, and positive feedback.</p>
                <div className="text-xs text-pink-600 dark:text-pink-400">Color: Pink theme with various shades</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="mr-2 text-yellow-500" size={20} />
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Memories</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For sharing cherished moments and special experiences together.</p>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">Color: Yellow theme with various shades</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Smile className="mr-2 text-purple-500" size={20} />
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">Feelings</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">For expressing emotions, moods, and emotional states.</p>
                <div className="text-xs text-purple-600 dark:text-purple-400">Color: Purple theme with various shades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Features */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Core Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700 dark:text-green-300 text-lg">Messaging System</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Message Creation</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Users can create messages with title, description, priority level, and mood selection.</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Response System</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Recipients can respond to messages with their own thoughts and solutions.</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Status Tracking</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Messages have statuses: sent, responded, resolved.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700 dark:text-green-300 text-lg">Inbox & Outbox</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Inbox</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Messages received from partner with respond functionality.</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Outbox</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Messages sent to partner with view and resolve functionality.</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Latest Highlighting</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Most recent messages are visually highlighted with special styling.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Special Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <div className="flex items-center mb-3">
                  <HeartCrack className="mr-2 text-red-500" size={20} />
                  <h4 className="font-semibold text-red-700 dark:text-red-300">Clear All Feature</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Allows couples to start fresh by clearing all messages after mutual agreement.</p>
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>• Send "Broken Heart" request to partner</div>
                  <div>• Partner receives notification</div>
                  <div>• Both must agree to proceed</div>
                  <div>• All messages are permanently deleted</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center mb-3">
                  <CheckCircle className="mr-2 text-blue-500" size={20} />
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Resolution System</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Mark grievances as resolved when issues are addressed.</p>
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>• Only sender can mark as resolved</div>
                  <div>• Requires at least one response</div>
                  <div>• Changes message status to "resolved"</div>
                  <div>• Celebrates successful resolution</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Technical Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Vite for build tooling</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Shadcn/ui component library</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Backend</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Firebase Authentication</li>
                  <li>• Firestore Database</li>
                  <li>• Real-time listeners</li>
                  <li>• Server timestamps</li>
                  <li>• Security rules</li>
                </ul>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Dark/Light theme toggle</li>
                  <li>• Responsive design</li>
                  <li>• Real-time updates</li>
                  <li>• Toast notifications</li>
                  <li>• Form validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Journey */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-teal-200 dark:border-teal-700 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-600 dark:text-teal-400">User Journey Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="font-medium text-teal-700 dark:text-teal-300">Landing & Authentication</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User visits homepage, registers/logs in with email and password</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="font-medium text-teal-700 dark:text-teal-300">Profile Setup</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set nickname, partner email, and customize profile settings</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="font-medium text-teal-700 dark:text-teal-300">Dashboard Access</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View dashboard with recent messages, partner info, and quick actions</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h5 className="font-medium text-teal-700 dark:text-teal-300">Message Exchange</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send messages, receive notifications, respond to partner's messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h5 className="font-medium text-teal-700 dark:text-teal-300">Resolution & Growth</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Work through issues together, mark as resolved, and strengthen relationship</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI/UX Design Principles */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-rose-200 dark:border-rose-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-600 dark:text-rose-400">UI/UX Design Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-rose-700 dark:text-rose-300">Visual Design</h4>
                <div className="space-y-3">
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Color Psychology</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warm colors (pink, red) for love and passion, cool colors (purple, blue) for trust and communication.</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Gradient Backgrounds</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Soft gradient backgrounds create a romantic, welcoming atmosphere.</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Typography</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clean, readable fonts with appropriate hierarchy and spacing.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-rose-700 dark:text-rose-300">User Experience</h4>
                <div className="space-y-3">
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Intuitive Navigation</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clear pathways between features with consistent navigation patterns.</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Responsive Design</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimized for all device sizes with mobile-first approach.</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded">
                    <h5 className="font-medium text-rose-600 dark:text-rose-400">Feedback Systems</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Toast notifications and visual indicators provide immediate feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
