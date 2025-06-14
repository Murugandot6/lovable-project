
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle, ArrowLeft } from "lucide-react";

interface ThankYouPageProps {
  onBack: () => void;
}

export const ThankYouPage = ({ onBack }: ThankYouPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 border-green-200">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Thank You! 💕
            </CardTitle>
            <div className="flex justify-center space-x-2 mb-4">
              <span className="text-2xl">🌟</span>
              <span className="text-2xl">✨</span>
              <span className="text-2xl">💖</span>
              <span className="text-2xl">✨</span>
              <span className="text-2xl">🌟</span>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Your concern has been submitted successfully! 🎉
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We believe that open communication is the foundation of every strong relationship. 
                Your courage to share your feelings is a beautiful step toward understanding and growth together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <Heart className="text-pink-500 mx-auto mb-2" size={24} />
                <h4 className="font-semibold text-pink-700 mb-1">Express with Love</h4>
                <p className="text-sm text-pink-600">Your partner will receive this with care and understanding</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <CheckCircle className="text-purple-500 mx-auto mb-2" size={24} />
                <h4 className="font-semibold text-purple-700 mb-1">Track Progress</h4>
                <p className="text-sm text-purple-600">Monitor updates and responses in your dashboard</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700 font-medium mb-2">💌 What happens next?</p>
              <p className="text-sm text-blue-600">
                Your partner will be notified and can respond with their thoughts and planned actions. 
                Together, you can work toward a resolution that strengthens your bond.
              </p>
            </div>

            <Button 
              onClick={onBack}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
