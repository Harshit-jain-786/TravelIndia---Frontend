import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Leaf, Users, MapPin, Package, Star } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      name: "Rahul Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Priya Patel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Arjun Kumar",
      role: "Travel Experience Designer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We believe in showcasing the real India - its traditions, cultures, and hidden gems that make every journey unique.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Your safety and comfort are our top priorities. We ensure all our partners meet the highest safety standards.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to responsible tourism that benefits local communities and preserves India's natural beauty.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Travelers" },
    { number: "500+", label: "Destinations" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "8+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6" data-testid="page-title-about">
              About TravelIndia
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Discover the beauty, culture, and diversity of Incredible India with our expertly crafted travel experiences
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6" data-testid="section-title-our-story">
                Our Story
              </h2>
              <p className="text-muted text-lg mb-6">
                Founded in 2015 with a passion for showcasing India's incredible diversity, TravelIndia has been creating 
                unforgettable experiences for travelers from around the world. Our mission is to make authentic Indian 
                experiences accessible to everyone.
              </p>
              <p className="text-muted text-lg">
                From the snow-capped peaks of the Himalayas to the sun-kissed beaches of the South, from bustling 
                metropolitan cities to serene village escapes, we curate journeys that capture the essence of this 
                magnificent country.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Travel planning team"
              className="rounded-2xl shadow-xl"
              data-testid="img-story"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12" data-testid="section-title-our-values">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary mb-3" data-testid={`value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-muted">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} data-testid={`stat-${index}`}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-orange-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4" data-testid="section-title-meet-our-team">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted">
              The passionate professionals who make your travel dreams come true
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    data-testid={`team-member-image-${index}`}
                  />
                  <h3 className="text-xl font-semibold text-secondary" data-testid={`team-member-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-muted">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4" data-testid="section-title-why-choose-us">
              Why Choose TravelIndia?
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              We go beyond ordinary travel to create extraordinary experiences that connect you with the heart of India
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">Expert Guides</h3>
              <p className="text-muted text-sm">Local experts who bring destinations to life with authentic stories</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">Unique Destinations</h3>
              <p className="text-muted text-sm">Hidden gems and off-the-beaten-path locations you won't find elsewhere</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">Custom Packages</h3>
              <p className="text-muted text-sm">Tailored experiences designed to match your interests and budget</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">24/7 Support</h3>
              <p className="text-muted text-sm">Round-the-clock assistance to ensure your journey is worry-free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6" data-testid="section-title-our-mission">
            Our Mission
          </h2>
          <p className="text-xl text-muted leading-relaxed mb-8">
            "To make India's incredible diversity accessible to every traveler while preserving its cultural heritage 
            and natural beauty for future generations. We believe travel has the power to build bridges between cultures, 
            create lasting memories, and contribute to sustainable development of local communities."
          </p>
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore India?</h3>
            <p className="text-lg mb-6 text-orange-100">
              Join thousands of satisfied travelers who have discovered the magic of India with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/packages" 
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                data-testid="button-view-packages"
              >
                View Our Packages
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                data-testid="button-contact-us"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
