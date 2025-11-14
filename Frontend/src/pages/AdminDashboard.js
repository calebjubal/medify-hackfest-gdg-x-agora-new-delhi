import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Activity, TrendingUp, ArrowLeft, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/doctors`),
        axios.get(`${API}/patients`),
        axios.get(`${API}/appointments`)
      ]);
      setStats(statsRes.data);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
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

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="card-hover border-0 shadow-lg" data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Manage hospital operations</p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            icon={Users}
            color="from-blue-500 to-cyan-500"
            trend="+12% this month"
          />
          <StatCard
            title="Total Doctors"
            value={stats?.totalDoctors || 0}
            icon={Activity}
            color="from-emerald-500 to-teal-500"
            trend="+2 new"
          />
          <StatCard
            title="Today's Appointments"
            value={stats?.todayAppointments || 0}
            icon={Calendar}
            color="from-violet-500 to-purple-500"
          />
          <StatCard
            title="Availability Used"
            value={`${stats?.availabilityUsed || 0}%`}
            icon={TrendingUp}
            color="from-pink-500 to-rose-500"
          />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="doctors" data-testid="doctors-tab">Doctors</TabsTrigger>
            <TabsTrigger value="patients" data-testid="patients-tab">Patients</TabsTrigger>
            <TabsTrigger value="appointments" data-testid="appointments-tab">Appointments</TabsTrigger>
          </TabsList>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Doctors Management</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search doctors..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="search-doctors-input"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-doctor-btn">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Doctor
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="card-hover border border-slate-200" data-testid={`doctor-card-${doctor.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-800">{doctor.name}</h3>
                            <Badge className="mb-2">{doctor.specialty}</Badge>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>{doctor.email}</p>
                              <p>{doctor.phone}</p>
                              <p className="font-medium text-slate-800">{doctor.experience} years experience</p>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-semibold">{doctor.rating}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Patients Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <Card key={patient.id} className="border border-slate-200" data-testid={`patient-card-${patient.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-violet-100 text-violet-700">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                              <p className="text-sm text-slate-600">{patient.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{patient.gender}</Badge>
                            <p className="text-sm text-slate-600 mt-1">{patient.age} years</p>
                          </div>
                        </div>
                        {patient.medicalHistory.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-slate-600 mb-2">Medical History:</p>
                            <div className="flex gap-2 flex-wrap">
                              {patient.medicalHistory.map((condition, idx) => (
                                <Badge key={idx} variant="secondary">{condition}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <Card key={apt.id} className="border border-slate-200" data-testid={`appointment-card-${apt.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{apt.patientName}</h3>
                              <Badge className={apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">Doctor: {apt.doctorName} - {apt.doctorSpecialty}</p>
                            <p className="text-sm text-slate-600 mb-1">Date: {apt.date} at {apt.time}</p>
                            <p className="text-sm text-slate-600">Symptoms: {apt.symptoms}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;