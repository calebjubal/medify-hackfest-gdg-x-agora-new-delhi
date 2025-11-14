import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mic, MicOff, Volume2, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

const VoiceBooking = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      message: "Hello! I'm your AI booking assistant. How can I help you book an appointment today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [suggestedSlot, setSuggestedSlot] = useState(null);

  // Mock voice recognition simulation
  const handleStartListening = () => {
    setIsListening(true);
    toast.info("Listening... Speak now");

    // Simulate user input after 2 seconds
    setTimeout(() => {
      const userMessage = "I need to see a cardiologist for chest pain";
      setConversation(prev => [...prev, {
        role: "user",
        message: userMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);

      // AI response
      setTimeout(() => {
        setIsListening(false);
        const aiResponse = "I understand you need to see a cardiologist for chest pain. Let me find the best available slot for you. I recommend Dr. Sarah Johnson, our top-rated cardiologist.";
        setConversation(prev => [...prev, {
          role: "assistant",
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString()
        }]);

        // Show suggested slot
        setTimeout(() => {
          setSuggestedSlot({
            doctor: {
              name: "Dr. Sarah Johnson",
              specialty: "Cardiology",
              rating: 4.8,
              image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
            },
            date: "2025-01-20",
            time: "09:00",
            reason: "Urgent care needed, doctor available, high patient ratings"
          });
        }, 1000);
      }, 2000);
    }, 2000);
  };

  const handleStopListening = () => {
    setIsListening(false);
    toast.success("Stopped listening");
  };

  const handleBookSlot = () => {
    toast.success("Appointment booked successfully!");
    setTimeout(() => {
      navigate("/dashboard/patient");
    }, 1500);
  };

  const handleReplayVoice = () => {
    toast.info("Replaying AI response...");
  };

  useEffect(() => {
    // Auto-scroll to bottom of conversation
    const conversationElement = document.getElementById('conversation-feed');
    if (conversationElement) {
      conversationElement.scrollTop = conversationElement.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/patient")}
              data-testid="back-to-patient-dashboard-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Voice AI Booking</h1>
              <p className="text-sm text-slate-600">Speak naturally to book your appointment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Microphone Section */}
        <Card className="mb-8 border-0 shadow-xl" data-testid="voice-input-card">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-gradient-to-br from-red-500 to-pink-500 pulse'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:scale-105'
                  } shadow-2xl`}
                  data-testid="voice-recording-btn"
                >
                  {isListening ? (
                    <MicOff className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </button>
                
                {/* Animated rings when listening */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-pulse"></div>
                  </>
                )}
              </div>

              <div className="mb-6">
                <Badge className={isListening ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                  {isListening ? 'Listening...' : 'Ready to listen'}
                </Badge>
              </div>

              {/* Sound Wave Visualization */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 h-16 mb-6" data-testid="sound-wave">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full wave-bar"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    ></div>
                  ))}
                </div>
              )}

              <p className="text-slate-600">
                {isListening
                  ? 'Speak clearly about your medical needs...'
                  : 'Tap the microphone to start speaking'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Feed */}
        <Card className="mb-8 border-0 shadow-lg" data-testid="conversation-feed-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Conversation</h3>
            <div
              id="conversation-feed"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 fade-in ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  data-testid={`conversation-message-${index}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-violet-200' : 'text-slate-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-violet-600 text-white text-xs">JD</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Slot */}
        {suggestedSlot && (
          <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white fade-in" data-testid="suggested-slot-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold">Recommended Appointment</h3>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={suggestedSlot.doctor.image} alt={suggestedSlot.doctor.name} />
                    <AvatarFallback>{suggestedSlot.doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold">{suggestedSlot.doctor.name}</h4>
                    <p className="text-emerald-100">{suggestedSlot.doctor.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-300">★</span>
                      <span className="text-sm font-semibold">{suggestedSlot.doctor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-emerald-100">Date</p>
                      <p className="font-semibold">{suggestedSlot.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-emerald-100">Time</p>
                      <p className="font-semibold">{suggestedSlot.time}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-emerald-100 mb-1">Why this slot?</p>
                  <p className="text-sm">{suggestedSlot.reason}</p>
                </div>
              </div>

              <Button
                onClick={handleBookSlot}
                className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-6 text-lg"
                data-testid="book-suggested-slot-btn"
              >
                Book This Appointment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bottom Controls */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Button
            onClick={handleStartListening}
            variant="outline"
            className="py-6"
            disabled={isListening}
            data-testid="start-recording-btn"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
          <Button
            onClick={handleStopListening}
            variant="outline"
            className="py-6"
            disabled={!isListening}
            data-testid="stop-recording-btn"
          >
            <MicOff className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
          <Button
            onClick={handleReplayVoice}
            variant="outline"
            className="py-6"
            data-testid="replay-voice-btn"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Replay AI Voice
          </Button>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate("/dashboard/patient")}
            className="text-violet-600"
            data-testid="manual-booking-link"
          >
            Switch to Manual Booking
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VoiceBooking;