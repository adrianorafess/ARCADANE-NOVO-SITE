import * as React from 'react';

declare global {
  const __APP_VERSION__: string;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'befly-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { language?: string; 'new-tab'?: string }, HTMLElement>;
    }
  }
}

export enum PageId {
  Home = 'home',
  Services = 'services',
  Packages = 'packages',
  AboutUs = 'about-us',
  CustomTrip = 'custom-trip',
  Blog = 'blog',
  ContactUs = 'contact-us',
  Privacy = 'privacy',
  TravelQuiz = 'travel-quiz',
  Admin = 'admin'
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  rating: number;
  imageUrl?: string;
}

export interface PackageItem {
  id: string;
  title: string;
  category: 'exotico' | 'nacional' | 'cruzeiro' | 'eua';
  description: string;
  price: string;
  duration: string;
  imageWord: string; // Used to generate or show stylized vector icons/placeholders
  highlights: string[];
  image?: string; // Optional custom cover image URL
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

export interface LuxuryTrip {
  id: string;
  title: string;
  subTitle: string;
  operator: string;
  duration: string;
  tag: string;
  image: string;
  description: string;
  highlights: string[];
  link: string;
  badgeColor: string;
  waMessage: string;
}

export interface TripPlannerData {
  destinationType: 'nacional' | 'internacional' | '';
  destinationDetails: string;
  travelMonth: string;
  durationDays: number;
  travelersCount: number;
  kidsCount: number;
  travelStyle: 'luxury' | 'comfort' | 'backpack' | 'adventure' | 'family' | '';
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  additionalRequests: string;
}


