import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, Plane, Heart, Umbrella, Phone, Mail } from "lucide-react";

export default function Insurance() {
    const [quoteData, setQuoteData] = useState({ destination: "", duration: "", travelers: "1", age: "", tripValue: "" });
    const [quoteResult, setQuoteResult] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (field, value) => {
        setQuoteData(prev => ({ ...prev, [field]: value }));
    };
    const handleGetQuote = (e) => {
        e.preventDefault();
        let base = 899;
        if (quoteData.duration === "8-15") base = 1599;
        if (["16-30", "31-60", "60+"].includes(quoteData.duration)) base = 2999;
        const total = base * parseInt(quoteData.travelers || "1");
        setQuoteResult({ plan: base === 899 ? "Basic Coverage" : base === 1599 ? "Premium Coverage" : "Luxury Coverage", price: total, travelers: quoteData.travelers, duration: quoteData.duration });
    };
    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    const insurancePlans = [
        { id: 1, name: "Basic Coverage", price: 899, duration: "Up to 7 days", coverage: 500000, features: ["Medical Emergency Coverage", "Trip Cancellation", "Lost Baggage Protection", "24/7 Emergency Assistance", "Personal Accident Cover"], color: "border-travel-blue", buttonColor: "bg-travel-blue hover:bg-blue-700", popular: false },
        { id: 2, name: "Premium Coverage", price: 1599, duration: "Up to 15 days", coverage: 1000000, features: ["Comprehensive Medical Coverage", "Trip Cancellation & Interruption", "Lost Baggage & Personal Effects", "Adventure Sports Coverage", "Emergency Evacuation", "24/7 Concierge Service", "Pre-existing Medical Conditions"], color: "border-sunset-orange", buttonColor: "bg-sunset-orange hover:bg-orange-600", popular: true },
        { id: 3, name: "Luxury Coverage", price: 2999, duration: "Up to 30 days", coverage: 2000000, features: ["Premium Medical Coverage", "Comprehensive Trip Protection", "High-value Baggage Protection", "Adventure & Extreme Sports", "Emergency Medical Evacuation", "Repatriation of Mortal Remains", "Personal Liability Coverage", "Rental Car Protection", "VIP Assistance Services"], color: "border-luxury-purple", buttonColor: "bg-luxury-purple hover:bg-purple-700", popular: false }
    ];
    const coverageAreas = [
        { icon: Heart, title: "Medical Emergency", description: "Coverage for medical treatments, hospitalization, and emergency medical evacuation" },
        { icon: Plane, title: "Trip Protection", description: "Reimbursement for trip cancellation, interruption, and travel delays" },
        { icon: Umbrella, title: "Personal Belongings", description: "Protection for lost, stolen, or damaged baggage and personal items" },
        { icon: Shield, title: "Adventure Sports", description: "Specialized coverage for adventure activities and extreme sports" }
    ];
    const handleSelectPlan = (plan) => { setSelectedPlan(plan); setShowModal(true); };
    const closeModal = () => setShowModal(false);
    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            {/* Add extra space at top */}
            <div className="h-8 md:h-16 lg:h-20" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">Travel Insurance</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Protect your journey with comprehensive travel insurance coverage. Travel with peace of mind knowing you're covered for unexpected events.</p>
                </div>
                {/* Quick Quote Form */}
                <Card className="mb-12 animate-fade-in shadow-lg">
                    <CardHeader><CardTitle className="text-center text-2xl">Get Your Quote in Minutes</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleGetQuote}>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                <div className="space-y-2"><Label htmlFor="destination">Destination</Label><Input id="destination" type="text" placeholder="Where are you going?" value={quoteData.destination} onChange={(e) => handleInputChange("destination", e.target.value)} data-testid="input-destination" /></div>
                                <div className="space-y-2"><Label htmlFor="duration">Trip Duration</Label><Select value={quoteData.duration} onValueChange={(value) => handleInputChange("duration", value)}><SelectTrigger data-testid="select-duration"><SelectValue placeholder="Select duration" /></SelectTrigger><SelectContent><SelectItem value="1-7">1-7 days</SelectItem><SelectItem value="8-15">8-15 days</SelectItem><SelectItem value="16-30">16-30 days</SelectItem><SelectItem value="31-60">31-60 days</SelectItem><SelectItem value="60+">60+ days</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="travelers">Travelers</Label><Select value={quoteData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}><SelectTrigger data-testid="select-travelers"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 Traveler</SelectItem><SelectItem value="2">2 Travelers</SelectItem><SelectItem value="3">3 Travelers</SelectItem><SelectItem value="4">4 Travelers</SelectItem><SelectItem value="5+">5+ Travelers</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="age">Age (Oldest Traveler)</Label><Input id="age" type="number" placeholder="Age" value={quoteData.age} onChange={(e) => handleInputChange("age", e.target.value)} data-testid="input-age" /></div>
                                <div className="space-y-2"><Label>&nbsp;</Label><Button type="submit" className="w-full bg-travel-blue hover:bg-blue-700 transition-transform duration-300 active:scale-95" data-testid="button-get-quote">Get Quote</Button></div>
                            </div>
                        </form>
                        {/* Quote Result Display */}
                        {quoteResult && (<div className="mt-6 p-6 bg-blue-50 rounded-xl text-center animate-fade-in"><h3 className="text-xl font-bold text-blue-700 mb-2">Estimated Quote</h3><p className="text-lg text-gray-700 mb-2">Plan: <span className="font-semibold">{quoteResult.plan}</span></p><p className="text-lg text-gray-700 mb-2">Travelers: <span className="font-semibold">{quoteResult.travelers}</span></p><p className="text-lg text-gray-700 mb-2">Duration: <span className="font-semibold">{quoteResult.duration}</span></p><p className="text-2xl font-bold text-blue-900">{formatPrice(quoteResult.price)}</p></div>)}
                    </CardContent>
                </Card>
                {/* Insurance Plans */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8" data-testid="plans-title">Choose Your Protection Plan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {insurancePlans.map((plan) => (
                            <Card key={plan.id} className={`relative ${plan.color} border-2 ${plan.popular ? 'scale-105 shadow-xl' : 'hover:shadow-lg'} transition-all duration-300 animate-fade-in`} data-testid={`insurance-plan-${plan.id}`}>
                                {plan.popular && (<div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><Badge className="bg-sunset-orange text-white px-4 py-1">Most Popular</Badge></div>)}
                                <CardHeader className="text-center"><CardTitle className="text-2xl">{plan.name}</CardTitle><div className="mt-4"><span className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</span><p className="text-gray-600 mt-2">{plan.duration}</p><p className="text-sm text-gray-500">Coverage up to {formatPrice(plan.coverage)}</p></div></CardHeader>
                                <CardContent><ul className="space-y-3 mb-6">{plan.features.map((feature, index) => (<li key={index} className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{feature}</span></li>))}</ul><Button className={`w-full ${plan.buttonColor} transition-transform duration-300 active:scale-95`} data-testid={`button-select-plan-${plan.id}`} onClick={() => handleSelectPlan(plan)}>Select This Plan</Button></CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                {/* Coverage Areas */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8" data-testid="coverage-title">What's Covered</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coverageAreas.map((area, index) => (<Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 animate-fade-in" data-testid={`coverage-area-${index}`}><CardContent className="p-6"><div className="bg-travel-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><area.icon className="w-8 h-8 text-travel-blue" /></div><h3 className="text-xl font-semibold text-gray-900 mb-2">{area.title}</h3><p className="text-gray-600">{area.description}</p></CardContent></Card>))}
                    </div>
                </div>
                {/* Why Choose Our Insurance */}
                <Card className="bg-gradient-to-br from-travel-blue to-blue-700 text-white mb-12 animate-fade-in">
                    <CardContent className="p-8"><h2 className="text-3xl font-bold mb-6 text-center">Why Choose WanderLust Insurance?</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="text-center"><div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-8 h-8" /></div><h3 className="text-xl font-semibold mb-2">24/7 Global Support</h3><p className="opacity-90">Round-the-clock emergency assistance wherever you are in the world</p></div><div className="text-center"><div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8" /></div><h3 className="text-xl font-semibold mb-2">Fast Claim Processing</h3><p className="opacity-90">Quick and hassle-free claim settlement with digital documentation</p></div><div className="text-center"><div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="w-8 h-8" /></div><h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3><p className="opacity-90">Over 100,000 travelers have trusted us to protect their journeys</p></div></div></CardContent>
                </Card>
                {/* Contact Information */}
                <Card className="animate-fade-in">
                    <CardContent className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing the Right Plan?</h2><p className="text-gray-600 mb-6">Our insurance experts are here to help you find the perfect coverage for your trip.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Button className="bg-travel-blue hover:bg-blue-700" data-testid="button-call-expert"><Phone className="w-4 h-4 mr-2" />Call Expert: +91 98765 43210</Button><Button variant="outline" data-testid="button-email-expert"><Mail className="w-4 h-4 mr-2" />Email: insurance@wanderlust.com</Button></div></CardContent>
                </Card>
                {/* Modal for Plan Details */}
                {showModal && selectedPlan && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"><div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"><button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={closeModal}>&times;</button><h2 className="text-2xl font-bold mb-4 text-center">{selectedPlan.name}</h2><div className="mb-4 text-center"><span className="text-3xl font-bold text-gray-900">{formatPrice(selectedPlan.price)}</span><p className="text-gray-600 mt-2">{selectedPlan.duration}</p><p className="text-sm text-gray-500">Coverage up to {formatPrice(selectedPlan.coverage)}</p></div><ul className="space-y-3 mb-6">{selectedPlan.features.map((feature, idx) => (<li key={idx} className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{feature}</span></li>))}</ul><Button className={`w-full ${selectedPlan.buttonColor}`}>Book This Plan</Button></div></div>)}
            </div>
        </div>
    );
}
