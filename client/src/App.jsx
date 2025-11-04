import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Flights from "@/pages/flights";
import Hotels from "@/pages/hotels";
import Packages from "@/pages/packages";
import Destinations from "@/pages/destinations";
import DestinationDetail from "@/pages/destination-detail";
import PackageDetail from "@/pages/package-detail";
import HotelDetail from "@/pages/hotel-detail";
import FlightDetail from "@/pages/flight-detail";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Checkout from "@/pages/checkout";
import BookingConfirmation from "@/pages/booking-confirmation";
import Dashboard from "@/pages/dashboard";
import Adventure from "@/pages/adventure";
import Insurance from "@/pages/insurance";
import ForgotPassword from "@/pages/forgot-password";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { AuthProvider } from "@/context/AuthContext";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/flights" component={Flights} />
        <Route path="/hotels" component={Hotels} />
        <Route path="/packages" component={Packages} />
        <Route path="/packages/:id" component={PackageDetail} />
        <Route path="/hotels/:id" component={HotelDetail} />
        <Route path="/flights/:id" component={FlightDetail} />
        <Route path="/destinations" component={Destinations} />
        <Route path="/destinations/:id" component={DestinationDetail} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/booking-confirmation/:id" component={BookingConfirmation} />
        <Route path="/dashboard" component={Dashboard} />
  <Route path="/adventure" component={Adventure} />
  <Route path="/insurance" component={Insurance} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;