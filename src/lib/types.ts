// Tipos do App de Corrida

export type SubscriptionPlan = 'free' | 'basic' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: SubscriptionPlan;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  runnerProfile?: RunnerProfileType;
  hasCompletedQuiz?: boolean;
}

export interface RunnerProfileType {
  type: string;
  title: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
  completedAt: string;
}

export interface GPSCoordinate {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
}

export interface Run {
  id: string;
  date: string;
  distance: number; // em km
  duration: number; // em minutos
  pace: number; // min/km
  calories?: number;
  notes?: string;
  gpsRoute?: GPSCoordinate[]; // Rota GPS
  elevationGain?: number; // Ganho de elevação em metros
  maxSpeed?: number; // Velocidade máxima em km/h
  avgSpeed?: number; // Velocidade média em km/h
  isPublic?: boolean; // Se a corrida está pública para compartilhar
  shareUrl?: string; // URL de compartilhamento
}

export interface ElectrolyteCalculation {
  weight: number; // kg
  duration: number; // minutos
  intensity: 'low' | 'moderate' | 'high';
  temperature: 'cool' | 'moderate' | 'hot';
  sodium: number; // mg
  potassium: number; // mg
  water: number; // ml
}

export interface Training {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutos
  type: 'interval' | 'long' | 'tempo' | 'recovery';
  completed?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  isPremium?: boolean;
  sharedRun?: Run; // Corrida compartilhada
}

export interface Stats {
  totalRuns: number;
  totalDistance: number;
  totalTime: number;
  averagePace: number;
  bestPace: number;
  thisWeek: {
    runs: number;
    distance: number;
  };
  thisMonth: {
    runs: number;
    distance: number;
  };
}
