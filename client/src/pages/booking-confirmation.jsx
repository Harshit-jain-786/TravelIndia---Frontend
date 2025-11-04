import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Users, Phone, Mail, Download, Share } from "lucide-react";

export default function BookingConfirmation() {
  const [match, params] = useRoute("/booking-confirmation/:id");
  const bookingId = params?.id;

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="h-8 bg-gray-300 w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 w-48 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Booking Not Found</h1>
          <p className="text-muted mb-8">The booking you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-orange-600">
              View All Bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookingTypeName = (type) => {
    const types = {
      'package': 'Travel Package',
      'flight': 'Flight',
      'hotel': 'Hotel'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="title-booking-confirmed">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-muted mb-2">
            Your booking has been successfully confirmed
          </p>
          <p className="text-lg text-primary font-medium" data-testid="text-booking-id">
            Booking ID: #{booking.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">Trip Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Badge variant="secondary" className="mr-2">
                          {getBookingTypeName(booking.bookingType)}
                        </Badge>
                        <span className="text-muted">Booking Type</span>
                      </div>
                      {booking.travelDate && (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span>Travel Date: {formatDate(booking.travelDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        <span>
                          {booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Status: </span>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="ml-2">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-secondary mb-3">Traveler Information</h3>
                    <div className="space-y-2">
                      {booking.travelerInfo && (
                        <>
                          <div className="text-sm">
                            <span className="font-medium">Name: </span>
                            {booking.travelerInfo.firstName} {booking.travelerInfo.lastName}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-primary" />
                            {booking.travelerInfo.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-primary" />
                            {booking.travelerInfo.phone}
                          </div>
                          {booking.travelerInfo.dateOfBirth && (
                            <div className="text-sm">
                              <span className="font-medium">Date of Birth: </span>
                              {formatDate(booking.travelerInfo.dateOfBirth)}
                            </div>
                          )}
                          {booking.travelerInfo.gender && (
                            <div className="text-sm">
                              <span className="font-medium">Gender: </span>
                              {booking.travelerInfo.gender.charAt(0).toUpperCase() + booking.travelerInfo.gender.slice(1)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-secondary mb-3">Special Requests</h3>
                    <p className="text-muted bg-gray-50 p-3 rounded-lg">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Booking Date:</span>
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Payment Status:</span>
                        <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'destructive'}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary" data-testid="text-booking-amount">
                        ₹{parseInt(booking.totalAmount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-muted">Total Amount</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary hover:bg-orange-600" data-testid="button-download-voucher">
                  <Download className="w-4 h-4 mr-2" />
                  Download Voucher
                </Button>
                
                <Button variant="outline" className="w-full" data-testid="button-share-booking">
                  <Share className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-view-all-bookings">
                    View All Bookings
                  </Button>
                </Link>

                <Link href="/packages">
                  <Button variant="outline" className="w-full" data-testid="button-book-another">
                    Book Another Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted">
                  • Please carry a valid government ID during travel
                </p>
                <p className="text-muted">
                  • Check-in opens 2 hours before departure
                </p>
                <p className="text-muted">
                  • Free cancellation up to 48 hours before travel
                </p>
                <p className="text-muted">
                  • Contact support for any changes or queries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-secondary mb-2">Need Help?</h3>
              <p className="text-muted mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call: +91 98765 43210
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email: support@travelindia.com
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
