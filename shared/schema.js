import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Destinations table
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  state: text("state").notNull(),
  highlights: jsonb("highlights"),
  isActive: boolean("is_active").default(true),
});

// Travel packages table
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  duration: integer("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  images: jsonb("images"),
  destinationId: varchar("destination_id").references(() => destinations.id),
  category: text("category").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  reviewCount: integer("review_count").default(0),
  inclusions: jsonb("inclusions"),
  exclusions: jsonb("exclusions"),
  itinerary: jsonb("itinerary"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
});

// Hotels table
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  images: jsonb("images"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.0"),
  reviewCount: integer("review_count").default(0),
  starRating: integer("star_rating").notNull(),
  amenities: jsonb("amenities"),
  isActive: boolean("is_active").default(true),
});

// Flights table
export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  aircraftType: text("aircraft_type"),
  isNonStop: boolean("is_non_stop").default(true),
  availableSeats: integer("available_seats").default(100),
  isActive: boolean("is_active").default(true),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bookingType: text("booking_type").notNull(), // 'package', 'flight', 'hotel'
  packageId: varchar("package_id").references(() => packages.id),
  flightId: varchar("flight_id").references(() => flights.id),
  hotelId: varchar("hotel_id").references(() => hotels.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("confirmed"), // 'pending', 'confirmed', 'cancelled'
  paymentStatus: text("payment_status").default("completed"), // 'pending', 'completed', 'failed'
  travelerInfo: jsonb("traveler_info"),
  specialRequests: text("special_requests"),
  bookingDate: timestamp("booking_date").defaultNow(),
  travelDate: timestamp("travel_date"),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  numberOfTravelers: integer("number_of_travelers").default(1),
});

// Contact inquiries table
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"), // 'new', 'in_progress', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true });
export const insertPackageSchema = createInsertSchema(packages).omit({ id: true });
export const insertHotelSchema = createInsertSchema(hotels).omit({ id: true });
export const insertFlightSchema = createInsertSchema(flights).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, bookingDate: true });
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({ id: true, createdAt: true });


