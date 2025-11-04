
import { useState, useEffect } from "react";
import * as z from "zod";
import { useLocation, useRoute } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Smartphone, Building2, Shield } from "lucide-react";


export default function Checkout() {

  const [numberOfTravelers, setNumberOfTravelers] = useState(1); // Number of travelers state
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingType, setBookingType] = useState("");

  useEffect(() => {
    const savedBooking = localStorage.getItem('checkoutItem');
    if (savedBooking) {
      const booking = JSON.parse(savedBooking);
      setBookingType(booking.type);
      // Fetch item details from backend by type and id
      fetch(`/api/${booking.type}s/${booking.item.id}`)
        .then(res => res.json())
        .then(data => setBookingItem(data));
    } else {
      // Fallback mock data for demo
      setBookingItem({
        id: "1",
        name: "Kashmir Paradise Package",
        price: "24999",
        duration: 7,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
      });
      setBookingType("package");
    }
  }, []);


const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(["card", "upi", "netbanking"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardHolderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  specialRequests: "",
  paymentMethod: "card",
  cardNumber: "",
  cardHolderName: "",
  expiryDate: "",
  cvv: ""
};

const form = useForm({
  resolver: zodResolver(checkoutSchema),
  defaultValues: defaultFormValues
});

  const paymentMethod = form.watch("paymentMethod");

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      const bookingData = {
        bookingType,
        packageId: bookingType === "package" ? bookingItem?.id : undefined,
        flightId: bookingType === "flight" ? bookingItem?.id : undefined,
        hotelId: bookingType === "hotel" ? bookingItem?.id : undefined,
        totalAmount: calculateTotal(),
        numberOfTravelers,
        travelerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
        },
        specialRequests: data.specialRequests,
        travelDate: new Date().toISOString(),
        userId: "temp-user-id", // In real app, get from auth context
        status: "confirmed",
        paymentStatus: "completed",
      };

      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been confirmed successfully.",
      });
      setLocation(`/booking-confirmation/${booking.id}`);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to complete booking",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    bookingMutation.mutate(data);
  };

  const handleRazorpayPayment = async () => {
    // Create order on backend (replace with your backend endpoint)
    const orderRes = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: calculateTotal() * 100 }), // amount in paise
    });
    const order = await orderRes.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
      amount: order.amount,
      currency: "INR",
      name: "TravelVista Booking",
      description: `Booking for ${bookingItem?.name}`,
      image: bookingItem?.photo || bookingItem?.image,
      order_id: order.id,
      handler: async function (response) {
        // Send payment info to backend for verification and booking
        const verifyRes = await fetch("/api/verify-razorpay-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            bookingType,
            packageId: bookingType === "package" ? bookingItem?.id : undefined,
            flightId: bookingType === "flight" ? bookingItem?.id : undefined,
            hotelId: bookingType === "hotel" ? bookingItem?.id : undefined,
            totalAmount: calculateTotal(),
            numberOfTravelers,
            travelerInfo: {}, // Fill with form data if needed
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          setLocation(`/booking-confirmation/${result.bookingId}`);
        } else {
          toast({ title: "Payment Failed", description: "Could not verify payment.", variant: "destructive" });
        }
      },
      prefill: {
        name: form.getValues("firstName") + " " + form.getValues("lastName"),
        email: form.getValues("email"),
        contact: form.getValues("phone"),
      },
      theme: { color: "#2563eb" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const calculateSubtotal = () => {
    if (!bookingItem?.price) return 0;
    return parseInt(bookingItem.price) * numberOfTravelers;
  };

  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.1); // 10% tax
  };

  const calculateDiscount = () => {
    return 2500; // Fixed discount for demo
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes() - calculateDiscount();
  };

  if (!bookingItem) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">No Booking Selected</h1>
          <p className="text-muted mb-8">Please select an item to book first.</p>
          <Button onClick={() => setLocation("/packages")} className="bg-primary hover:bg-orange-600">
            Browse Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2" data-testid="page-title-checkout">
            Complete Your Booking
          </h1>
          <p className="text-muted">Review your selection and complete the payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form-checkout">
                {/* Traveler Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Traveler Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter first name"
                              data-testid="input-traveler-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter last name"
                              data-testid="input-traveler-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter email"
                              data-testid="input-traveler-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+91 98765 43210"
                              data-testid="input-traveler-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              data-testid="input-traveler-dob"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-traveler-gender">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Special Requests */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any special requests or requirements..."
                              rows={4}
                              data-testid="textarea-special-requests"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-3 gap-3"
                              data-testid="radio-payment-method"
                            >
                              <div>
                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                <Label
                                  htmlFor="card"
                                  className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-5 transition-colors"
                                >
                                  <div className="text-center">
                                    <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-medium">Card</p>
                                  </div>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                <Label
                                  htmlFor="upi"
                                  className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-5 transition-colors"
                                >
                                  <div className="text-center">
                                    <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-medium">UPI</p>
                                  </div>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="netbanking" id="netbanking" className="peer sr-only" />
                                <Label
                                  htmlFor="netbanking"
                                  className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-5 transition-colors"
                                >
                                  <div className="text-center">
                                    <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-medium">Net Banking</p>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentMethod === "card" && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="1234 5678 9012 3456"
                                  data-testid="input-card-number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardHolderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Holder Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John Doe"
                                  data-testid="input-card-holder-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="MM/YY"
                                  data-testid="input-expiry-date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="123"
                                  data-testid="input-cvv"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="border-b border-gray-200 pb-4">
                    <img
                      src={bookingItem.photo || bookingItem.image}
                      alt={bookingItem.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-secondary" data-testid="text-booking-item-name">
                      {bookingItem.name}
                    </h3>
                    {bookingItem.duration && (
                      <p className="text-sm text-muted">{bookingItem.duration} Days / {bookingItem.duration - 1} Nights</p>
                    )}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-muted">Travelers:</label>
                        <select
                          value={numberOfTravelers}
                          onChange={(e) => setNumberOfTravelers(parseInt(e.target.value))}
                          className="border rounded px-2 py-1 text-sm"
                          data-testid="select-number-travelers"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                          ))}
                        </select>
                      </div>
                      <span className="font-medium" data-testid="text-item-total">
                        ₹{calculateSubtotal().toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted">Package Cost</span>
                      <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Taxes & Fees</span>
                      <span>₹{calculateTaxes().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{calculateDiscount().toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-secondary">
                      <span>Total Amount</span>
                      <span data-testid="text-total-amount">
                        ₹{calculateTotal().toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRazorpayPayment}
                  className="w-full bg-primary hover:bg-orange-600 text-white font-semibold mb-4"
                  disabled={bookingMutation.isPending}
                  data-testid="button-complete-payment"
                >
                  {bookingMutation.isPending ? "Processing..." : "Complete Payment"}
                </Button>

                <div className="text-center text-sm text-muted">
                  <p className="mb-2">Secure payment powered by</p>
                  <div className="flex items-center justify-center space-x-4">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
