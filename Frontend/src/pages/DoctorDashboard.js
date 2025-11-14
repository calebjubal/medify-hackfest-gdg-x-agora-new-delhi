import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorInfo] = useState({
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/appointments`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const handleAccept = async (appointmentId) => {
    try {
      await axios.put(`${API}/appointments/${appointmentId}`, { status: 'confirmed' });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await axios.put(`${API}/appointments/${appointmentId}`, { status: 'cancelled' });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                data-testid="back-to-home-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
                <p className="text-sm text-slate-600">Manage your appointments</p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={doctorInfo.image} alt={doctorInfo.name} />
              <AvatarFallback className="bg-emerald-600 text-white">SJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white" data-testid="doctor-hero-banner">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={doctorInfo.image} alt={doctorInfo.name} />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold mb-2">{doctorInfo.name}</h2>
                <p className="text-emerald-50 text-lg">{doctorInfo.specialty}</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{appointments.length}</p>
                  <p className="text-emerald-50 text-sm">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                  <p className="text-emerald-50 text-sm">Upcoming</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{completedAppointments.length}</p>
                  <p className="text-emerald-50 text-sm">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-1 border-0 shadow-lg" data-testid="doctor-calendar">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border"
              />
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-sm text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-sm text-slate-600">Booked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card className="lg:col-span-2 border-0 shadow-lg" data-testid="appointments-list">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No upcoming appointments</p>
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="border border-slate-200 card-hover" data-testid={`appointment-card-${apt.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {apt.patientName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-800 text-lg">{apt.patientName}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{apt.date} at {apt.time}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">New</Badge>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Symptoms:</span> {apt.symptoms}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleAccept(apt.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            data-testid={`accept-appointment-${apt.id}-btn`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleReject(apt.id)}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            data-testid={`reject-appointment-${apt.id}-btn`}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Appointments */}
        {completedAppointments.length > 0 && (
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Completed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAppointments.map((apt) => (
                  <Card key={apt.id} className="border border-slate-200" data-testid={`completed-appointment-${apt.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {apt.patientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-800">{apt.patientName}</h3>
                            <p className="text-sm text-slate-600">{apt.date} at {apt.time}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-slate-600 mt-3"><span className="font-medium">Notes:</span> {apt.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;