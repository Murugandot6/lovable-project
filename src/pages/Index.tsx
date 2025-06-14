
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { GrievanceForm } from "@/components/GrievanceForm";
import { GrievanceDashboard } from "@/components/GrievanceDashboard";
import { AuthForm } from "@/components/AuthForm";
import { UserDashboard } from "@/components/UserDashboard";
import { ProfileEdit } from "@/components/ProfileEdit";
import { ThankYouPage } from "@/components/ThankYouPage";
import { AllGrievancesDashboard } from "@/components/AllGrievancesDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser, userData, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'submit' | 'dashboard' | 'login' | 'register' | 'userDashboard' | 'editProfile' | 'thankYou' | 'allGrievances'>('home');
  const [displayText, setDisplayText] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = [
    "Submit your grievances for my viewing pleasure",
    "Communicate better with your partner",
    "Resolve issues together through understanding",
    "Express feelings in a structured way",
    "Work together to find common ground"
  ];

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

  // Typing animation effect
  useEffect(() => {
    if (currentView !== 'home') return;

    const sentence = sentences[currentSentenceIndex];
    let charIndex = 0;
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (charIndex < sentence.length) {
        setDisplayText(sentence.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentSentenceIndex, currentView]);

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
              onViewAllGrievances={() => setCurrentView('allGrievances')}
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
        case 'allGrievances':
          return <AllGrievancesDashboard onBack={() => setCurrentView('userDashboard')} />;
        default:
          return userData ? (
            <UserDashboard 
              userData={userData} 
              onLogout={handleLogout}
              onSubmitGrievance={() => setCurrentView('submit')}
              onEditProfile={() => setCurrentView('editProfile')}
              onViewAllGrievances={() => setCurrentView('allGrievances')}
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
          <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            {/* Theme Toggle */}
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>

            {/* Main Content - Google-style layout */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              {/* Logo with Google Colors */}
              <div className="mb-8 text-center">
                <h1 className="text-8xl md:text-9xl font-normal mb-4 tracking-tight">
                  <span className="text-blue-500">a</span>
                  <span className="text-red-500">n</span>
                  <span className="text-yellow-500">b</span>
                  <span className="text-blue-500">a</span>
                  <span className="text-green-500">e</span>
                </h1>
                <div className="flex items-center justify-center">
                  <Heart className="text-pink-500 dark:text-pink-400 mr-2" size={24} />
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Grievance Portal
                  </p>
                </div>
              </div>

              {/* Search Bar with Typing Animation */}
              <div className="w-full max-w-xl mb-8">
                <div className="relative">
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-base min-h-[48px] flex items-center">
                    <span className="flex-1">{displayText}</span>
                    <span className="animate-pulse text-gray-400">|</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-2 sm:gap-4 justify-center">
                <Button 
                  onClick={() => setCurrentView('login')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded border border-gray-300 dark:border-gray-600 font-normal shadow-sm hover:shadow-md transition-all duration-200"
                  variant="outline"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => setCurrentView('register')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded border border-gray-300 dark:border-gray-600 font-normal shadow-sm hover:shadow-md transition-all duration-200"
                  variant="outline"
                >
                  Register
                </Button>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with love for better communication
                </p>
              </div>
            </footer>
          </div>
        );
    }
  };

  return renderView();
};

export default Index;
