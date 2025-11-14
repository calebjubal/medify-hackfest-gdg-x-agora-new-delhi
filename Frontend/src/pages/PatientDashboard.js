import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Mic, Search, Heart, FileText, Stethoscope } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const patientInfo = {
    name: "John Doe",
    age: 45,
    id: "pat1"
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API}/doctors`),
        axios.get(`${API}/appointments`)
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data.filter(apt => apt.patientId === patientInfo.id));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingDate || !bookingTime || !symptoms) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const newAppointment = {
        patientId: patientInfo.id,
        patientName: patientInfo.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        date: bookingDate.toISOString().split('T')[0],
        time: bookingTime,
        symptoms: symptoms
      };

      await axios.post(`${API}/appointments`, newAppointment);
      toast.success("Appointment booked successfully!");
      setIsBookingOpen(false);
      fetchData();
      resetBookingForm();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    }
  };

  const resetBookingForm = () => {
    setSelectedDoctor(null);
    setBookingDate(null);
    setBookingTime("");
    setSymptoms("");
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`${API}/appointments/${appointmentId}`, { status: 'cancelled' });
      toast.success("Appointment cancelled");
      fetchData();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                <h1 className="text-2xl font-bold text-slate-800">Patient Dashboard</h1>
                <p className="text-sm text-slate-600">Book and manage appointments</p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-violet-600 text-white">
                {patientInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white" data-testid="patient-welcome-banner">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {patientInfo.name}!</h2>
                <p className="text-violet-50 text-lg">Ready to book your next appointment?</p>
              </div>
              <div className="flex gap-3">
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-violet-600 hover:bg-violet-50 font-semibold" data-testid="quick-book-btn">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Quick Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="booking-dialog">
                    <DialogHeader>
                      <DialogTitle>Book an Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {!selectedDoctor ? (
                        <div>
                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              placeholder="Search doctors by name or specialty..."
                              className="pl-10"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              data-testid="doctor-search-input"
                            />
                          </div>
                          <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {filteredDoctors.map((doctor) => (
                              <Card
                                key={doctor.id}
                                className="cursor-pointer card-hover border-2 hover:border-violet-500"
                                onClick={() => setSelectedDoctor(doctor)}
                                data-testid={`select-doctor-${doctor.id}-card`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                      <AvatarImage src={doctor.image} alt={doctor.name} />
                                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
                                      <Badge className="mb-1">{doctor.specialty}</Badge>
                                      <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-sm font-semibold">{doctor.rating}</span>
                                        <span className="text-sm text-slate-600 ml-2">{doctor.experience} yrs exp</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <Card className="border-2 border-violet-200">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4 mb-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                                  <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-800">{selectedDoctor.name}</h3>
                                  <Badge>{selectedDoctor.specialty}</Badge>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(null)}>Change</Button>
                              </div>
                            </CardContent>
                          </Card>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Date</label>
                            <Calendar
                              mode="single"
                              selected={bookingDate}
                              onSelect={setBookingDate}
                              className="rounded-lg border"
                              disabled={(date) => date < new Date()}
                              data-testid="booking-date-calendar"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Time</label>
                            <Select value={bookingTime} onValueChange={setBookingTime}>
                              <SelectTrigger data-testid="booking-time-select">
                                <SelectValue placeholder="Choose a time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Symptoms / Reason</label>
                            <Input
                              placeholder="Describe your symptoms..."
                              value={symptoms}
                              onChange={(e) => setSymptoms(e.target.value)}
                              data-testid="symptoms-input"
                            />
                          </div>

                          <Button
                            className="w-full bg-violet-600 hover:bg-violet-700"
                            onClick={handleBookAppointment}
                            data-testid="confirm-booking-btn"
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => navigate("/dashboard/patient/voice-booking")}
                  className="bg-white text-violet-600 hover:bg-violet-50 font-semibold"
                  data-testid="voice-booking-btn"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Booking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Upcoming</p>
                  <p className="text-2xl font-bold text-slate-800">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Visits</p>
                  <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Records</p>
                  <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments & Doctors Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-lg" data-testid="upcoming-appointments-card">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No upcoming appointments</p>
                  <Button onClick={() => setIsBookingOpen(true)} data-testid="book-first-appointment-btn">
                    Book Your First Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="border border-slate-200" data-testid={`appointment-card-${apt.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{apt.doctorName}</h3>
                              <p className="text-sm text-slate-600">{apt.doctorSpecialty}</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{apt.time}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelAppointment(apt.id)}
                          data-testid={`cancel-appointment-${apt.id}-btn`}
                        >
                          Cancel Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Doctors */}
          <Card className="border-0 shadow-lg" data-testid="recommended-doctors-card">
            <CardHeader>
              <CardTitle>Recommended Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.slice(0, 3).map((doctor) => (
                  <Card key={doctor.id} className="border border-slate-200 card-hover" data-testid={`doctor-card-${doctor.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={doctor.image} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
                          <Badge variant="secondary" className="mb-1">{doctor.specialty}</Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-semibold">{doctor.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => { setSelectedDoctor(doctor); setIsBookingOpen(true); }} data-testid={`book-doctor-${doctor.id}-btn`}>
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;