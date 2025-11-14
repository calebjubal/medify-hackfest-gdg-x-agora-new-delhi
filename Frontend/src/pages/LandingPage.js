import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Calendar, Users, Mic } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Admin Dashboard",
      description: "Manage hospital operations, doctors, and users",
      icon: Users,
      path: "/dashboard/admin",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Doctor Dashboard",
      description: "Manage availability and appointments",
      icon: Activity,
      path: "/dashboard/doctor",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Patient Dashboard",
      description: "Book appointments and view medical history",
      icon: Calendar,
      path: "/dashboard/patient",
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">HealthDash</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Modern Healthcare
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Management System
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Streamline your medical practice with intelligent appointment booking,
            voice AI assistance, and comprehensive dashboard management.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => (
            <Card
              key={index}
              data-testid={`role-card-${role.title.toLowerCase().replace(' ', '-')}`}
              className="card-hover p-8 border-0 bg-white shadow-lg cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(role.path)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{role.title}</h3>
              <p className="text-slate-600 mb-6">{role.description}</p>
              <Button
                data-testid={`access-${role.title.toLowerCase().replace(' ', '-')}-btn`}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                Access Dashboard
              </Button>
            </Card>
          ))}
        </div>

        {/* Voice AI Feature Highlight */}
        <Card className="p-8 bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Mic className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-3">Voice AI Booking Assistant</h3>
              <p className="text-blue-50 text-lg">
                Book appointments naturally using voice commands. Our AI assistant understands your needs and finds the perfect slot.
              </p>
            </div>
            <Button
              data-testid="try-voice-booking-btn"
              onClick={() => navigate("/dashboard/patient/voice-booking")}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
            >
              Try Voice Booking
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Smart Scheduling</h4>
            <p className="text-slate-600">Intelligent appointment management with real-time availability</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Real-time Analytics</h4>
            <p className="text-slate-600">Comprehensive insights into your healthcare operations</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-6 h-6 text-violet-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Voice AI</h4>
            <p className="text-slate-600">Natural language booking with conversational AI</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;