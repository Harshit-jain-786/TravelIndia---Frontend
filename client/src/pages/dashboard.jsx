import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Phone, Mail, Edit, Plane, Hotel, Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bookings");

  // Get user data from localStorage
  const user = (() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  })();

  // Use a safe user id for API queries
  const userId = user.id || user._id || user.pk || "";

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/users", userId, "bookings"],
    enabled: !!userId,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingIcon = (type) => {
    const icons = {
      'package': Package,
      'flight': Plane,
      'hotel': Hotel
    };
    return icons[type] || Package;
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': CheckCircle,
      'pending': Clock,
      'cancelled': XCircle
    };
    return icons[status] || Clock;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-primary">
                <AvatarFallback className="text-white text-xl font-semibold">
                  {(user.first_name || user.firstName || "")[0]}
                  {(user.last_name || user.lastName || "")[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-secondary" data-testid="title-dashboard">
                  Welcome back, {user.first_name || user.firstName || ""} {user.last_name || user.lastName || ""}!
                </h1>
                <p className="text-muted">Manage your bookings and profile</p>
              </div>
            </div>
            <Link href="/packages">
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-orange-600" data-testid="button-book-new-trip">
                Book New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Total Bookings</p>
                  <p className="text-3xl font-bold text-secondary" data-testid="stat-total-bookings">
                    {bookings?.length ?? 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Total Spent</p>
                  <p className="text-3xl font-bold text-secondary" data-testid="stat-total-spent">
                    ₹{(user.totalSpent ?? 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Active Trips</p>
                  <p className="text-3xl font-bold text-secondary" data-testid="stat-active-trips">
                    {bookings?.filter(b => b.status === 'confirmed' && new Date(b.travelDate || b.bookingDate) >= new Date()).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full text-white">
          <TabsList className="grid text-white w-full grid-cols-2" data-testid="tabs-dashboard">
            <TabsTrigger value="bookings" className={activeTab === "bookings" ? "bg-primary text-white" : "text-white "}>My Bookings</TabsTrigger>
            <TabsTrigger value="profile" className={activeTab === "profile" ? "bg-primary text-white" : "text-white "}>Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 w-1/4"></div>
                            <div className="h-3 bg-gray-200 w-1/2"></div>
                          </div>
                          <div className="h-8 bg-gray-300 w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : bookings?.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const IconComponent = getBookingIcon(booking.bookingType);
                      const StatusIcon = getStatusIcon(booking.status);
                      return (
                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`booking-card-${booking.id}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-secondary" data-testid={`booking-type-${booking.id}`}>
                                  {booking.bookingType && typeof booking.bookingType === 'string'
                                    ? booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)
                                    : ''} Booking
                                </h3>
                                <p className="text-sm text-muted">
                                  Booking ID: #{String(booking.id).slice(0, 8).toUpperCase()}
                                </p>
                                <div className="flex items-center text-sm text-muted mt-1">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(booking.bookingDate)}
                                  {booking.numberOfTravelers > 1 && (
                                    <>
                                      <Users className="w-4 h-4 ml-3 mr-1" />
                                      {booking.numberOfTravelers} travelers
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center mb-2">
                                <StatusIcon className="w-4 h-4 mr-1" />
                                <Badge className={getStatusColor(booking.status)} data-testid={`booking-status-${booking.id}`}>
                                  {booking.status && typeof booking.status === 'string'
                                    ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                                    : ''}
                                </Badge>
                              </div>
                              <p className="text-lg font-bold text-primary" data-testid={`booking-amount-${booking.id}`}>
                                ₹{parseInt(booking.totalAmount).toLocaleString('en-IN')}
                              </p>
                              <Link href={`/booking-confirmation/${booking.id}`}>
                                <Button size="sm" variant="outline" className="mt-2" data-testid={`button-view-booking-${booking.id}`}>
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary mb-2">No Bookings Yet</h3>
                    <p className="text-muted mb-6">Start your journey by booking your first trip with us!</p>
                    <Link href="/packages">
                      <Button className="bg-primary hover:bg-orange-600" data-testid="button-browse-packages">
                        Browse Packages
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button size="sm" variant="outline" data-testid="button-edit-profile">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted">Full Name</label>
                    <p className="text-secondary">{user.first_name || user.firstName || ""} {user.last_name || user.lastName || ""}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted">Email Address</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-primary" />
                      <p className="text-secondary">{user.email}</p>
                    </div>
                  </div>  
                  <div>
                    <label className="text-sm font-medium text-muted">Phone Number</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      <p className="text-secondary">{user.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted">Receive booking updates and offers</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted">Control your data and privacy</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted">Update your password</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted block mb-2">Preferred Travel Style</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Adventure</Badge>
                      <Badge variant="secondary">Cultural</Badge>
                      <Badge variant="secondary">Relaxation</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted block mb-2">Budget Range</label>
                    <p className="text-secondary">₹15,000 - ₹50,000 per trip</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
