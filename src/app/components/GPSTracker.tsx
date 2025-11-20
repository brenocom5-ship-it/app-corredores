'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, MapPin, Navigation, TrendingUp, Zap } from 'lucide-react';
import { GPSCoordinate } from '@/lib/types';

interface GPSTrackerProps {
  onRunComplete: (data: {
    distance: number;
    duration: number;
    gpsRoute: GPSCoordinate[];
    elevationGain: number;
    maxSpeed: number;
    avgSpeed: number;
  }) => void;
}

export function GPSTracker({ onRunComplete }: GPSTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [gpsRoute, setGpsRoute] = useState<GPSCoordinate[]>([]);
  const [gpsError, setGpsError] = useState<string | null>(null);
  
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<GPSCoordinate | null>(null);

  // Calcular distância entre dois pontos GPS (Haversine formula)
  const calculateDistance = (coord1: GPSCoordinate, coord2: GPSCoordinate): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Iniciar rastreamento GPS
  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS não disponível neste dispositivo');
      return;
    }

    setIsTracking(true);
    setIsPaused(false);
    setGpsError(null);

    // Iniciar timer
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Iniciar rastreamento GPS
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord: GPSCoordinate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
        };

        setGpsRoute(prev => [...prev, newCoord]);

        // Calcular distância se houver posição anterior
        if (lastPositionRef.current) {
          const distanceIncrement = calculateDistance(lastPositionRef.current, newCoord);
          setDistance(prev => prev + distanceIncrement);

          // Calcular velocidade (km/h)
          const timeDiff = (newCoord.timestamp - lastPositionRef.current.timestamp) / 1000 / 3600; // horas
          if (timeDiff > 0) {
            const speed = distanceIncrement / timeDiff;
            setCurrentSpeed(speed);
            setMaxSpeed(prev => Math.max(prev, speed));
          }

          // Calcular ganho de elevação
          if (newCoord.altitude && lastPositionRef.current.altitude) {
            const elevDiff = newCoord.altitude - lastPositionRef.current.altitude;
            if (elevDiff > 0) {
              setElevationGain(prev => prev + elevDiff);
            }
          }
        }

        lastPositionRef.current = newCoord;
      },
      (error) => {
        console.error('GPS Error:', error);
        setGpsError('Erro ao acessar GPS. Verifique as permissões.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Pausar rastreamento
  const pauseTracking = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Retomar rastreamento
  const resumeTracking = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  // Parar rastreamento
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Calcular velocidade média
    const avgSpeed = duration > 0 ? (distance / (duration / 3600)) : 0;

    // Enviar dados da corrida
    onRunComplete({
      distance,
      duration: Math.floor(duration / 60), // converter para minutos
      gpsRoute,
      elevationGain,
      maxSpeed,
      avgSpeed,
    });

    // Reset
    setIsTracking(false);
    setIsPaused(false);
    setDuration(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setElevationGain(0);
    setGpsRoute([]);
    lastPositionRef.current = null;
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular pace (min/km)
  const currentPace = distance > 0 ? (duration / 60) / distance : 0;

  return (
    <Card className="bg-gradient-to-br from-orange-500 to-pink-600 border-0 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Navigation className="w-6 h-6" />
          Rastreamento GPS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gpsError && (
          <div className="bg-red-500/20 border border-red-300 rounded-lg p-4">
            <p className="text-sm text-white">{gpsError}</p>
          </div>
        )}

        {/* Stats em tempo real */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <p className="text-xs font-medium opacity-90">Distância</p>
            </div>
            <p className="text-2xl font-bold">{distance.toFixed(2)}</p>
            <p className="text-xs opacity-75">km</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4" />
              <p className="text-xs font-medium opacity-90">Tempo</p>
            </div>
            <p className="text-2xl font-bold">{formatTime(duration)}</p>
            <p className="text-xs opacity-75">h:m:s</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <p className="text-xs font-medium opacity-90">Pace</p>
            </div>
            <p className="text-2xl font-bold">{currentPace.toFixed(1)}</p>
            <p className="text-xs opacity-75">min/km</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-medium opacity-90">Velocidade</p>
            </div>
            <p className="text-2xl font-bold">{currentSpeed.toFixed(1)}</p>
            <p className="text-xs opacity-75">km/h</p>
          </div>
        </div>

        {/* Stats adicionais */}
        {isTracking && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs opacity-90 mb-1">Vel. Máxima</p>
              <p className="text-lg font-bold">{maxSpeed.toFixed(1)} km/h</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs opacity-90 mb-1">Elevação</p>
              <p className="text-lg font-bold">{elevationGain.toFixed(0)} m</p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          {isTracking && (
            <Badge className="bg-green-500 text-white border-0 px-4 py-1">
              {isPaused ? '⏸️ Pausado' : '🔴 Gravando'}
            </Badge>
          )}
          {gpsRoute.length > 0 && (
            <Badge className="bg-white/20 text-white border-0 px-4 py-1">
              {gpsRoute.length} pontos GPS
            </Badge>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-3">
          {!isTracking ? (
            <Button
              onClick={startTracking}
              className="flex-1 bg-white text-orange-600 hover:bg-gray-100 font-semibold h-12"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Corrida
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={pauseTracking}
                  className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600 font-semibold h-12"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={resumeTracking}
                  className="flex-1 bg-green-500 text-white hover:bg-green-600 font-semibold h-12"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Retomar
                </Button>
              )}
              <Button
                onClick={stopTracking}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 font-semibold h-12"
              >
                <Square className="w-5 h-5 mr-2" />
                Finalizar
              </Button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-xs opacity-90">
            💡 <strong>Dica:</strong> Mantenha o GPS ativado e o app aberto durante a corrida para melhor precisão.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
