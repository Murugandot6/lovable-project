import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageSquare, CheckCircle } from "lucide-react";
import { GrievanceForm } from "@/components/GrievanceForm";
import { GrievanceDashboard } from "@/components/GrievanceDashboard";
import { AuthForm } from "@/components/AuthForm";
import { UserDashboard } from "@/components/UserDashboard";
import { ProfileEdit } from "@/components/ProfileEdit";
import { ThankYouPage } from "@/components/ThankYouPage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser, userData, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'submit' | 'dashboard' | 'login' | 'register' | 'userDashboard' | 'editProfile' | 'thankYou'>('home');

  useEffect(() => {
    if (currentUser && userData) {
      if (!userData.nickname || !userData.partnerEmail) {
        setCurrentView('editProfile');
      } else {
        setCurrentView('userDashboard');
      }
    } else if (currentUser && !userData) {
      // User exists but no profile data
      setCurrentView('editProfile');
    } else {
      // Handle hash-based navigation for auth forms
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash === 'login') {
          setCurrentView('login');
        } else if (hash === 'register') {
          setCurrentView('register');
        } else {
          setCurrentView('home');
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      handleHashChange();

      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [currentUser, userData]);

  const handleAuthSuccess = () => {
    setCurrentView('userDashboard');
    window.location.hash = '';
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('home');
  };

  const handleProfileSave = () => {
    setCurrentView('userDashboard');
  };

  const renderView = () => {
    if (currentUser) {
      switch (currentView) {
        case 'userDashboard':
          return userData ? (
            <UserDashboard 
              userData={userData} 
              onLogout={handleLogout}
              onSubmitGrievance={() => setCurrentView('submit')}
              onEditProfile={() => setCurrentView('editProfile')}
            />
          ) : null;
        case 'editProfile':
          return (
            <ProfileEdit 
              userData={userData}
              onBack={() => setCurrentView('userDashboard')}
              onSave={handleProfileSave}
            />
          );
        case 'submit':
          return (
            <GrievanceForm 
              onBack={() => setCurrentView('userDashboard')}
              onSuccess={() => setCurrentView('thankYou')}
              userData={userData}
            />
          );
        case 'thankYou':
          return <ThankYouPage onBack={() => setCurrentView('userDashboard')} />;
        case 'dashboard':
          return <GrievanceDashboard onBack={() => setCurrentView('userDashboard')} />;
        default:
          return userData ? (
            <UserDashboard 
              userData={userData} 
              onLogout={handleLogout}
              onSubmitGrievance={() => setCurrentView('submit')}
              onEditProfile={() => setCurrentView('editProfile')}
            />
          ) : null;
      }
    }

    switch (currentView) {
      case 'login':
        return <AuthForm mode="login" onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} />;
      case 'register':
        return <AuthForm mode="register" onBack={() => setCurrentView('home')} onAuthSuccess={handleAuthSuccess} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Header */}
            <header className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-center mb-8">
                <Heart className="text-pink-500 mr-2" size={32} />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Welcome to your very own
                </h1>
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-pink-600 mb-4">
                  Grievance Portal
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  As requested, you can submit your grievances for my viewing pleasure.
                </p>
              </div>
            </header>

            {/* Auth Buttons */}
            <section className="container mx-auto px-4 pb-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  onClick={() => setCurrentView('login')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  👤 Login
                </Button>
                <Button 
                  onClick={() => setCurrentView('register')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  📝 Register
                </Button>
              </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Simple steps to help you and your partner communicate better and resolve issues together
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="bg-white/70 backdrop-blur-sm border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="text-pink-600" size={24} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">1. Share Your Concern</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      Express your feelings and concerns in a safe, structured way that promotes understanding.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Users className="text-purple-600" size={24} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">2. Collaborate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      Work together to understand each other's perspectives and find common ground.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="text-blue-600" size={24} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">3. Take Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      Implement agreed-upon solutions and track progress together toward resolution.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">Ready to Strengthen Your Relationship?</h3>
                <p className="text-xl mb-8 opacity-90">
                  Start your journey toward better communication and deeper understanding today.
                </p>
                <Button 
                  onClick={() => setCurrentView('register')}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now
                </Button>
              </div>
            </section>
          </div>
        );
    }
  };

  return renderView();
};

export default Index;
