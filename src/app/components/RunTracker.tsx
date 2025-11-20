'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Run } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Clock, Zap, Trash2, Navigation, Share2, MapPin, TrendingUp } from 'lucide-react';
import { GPSTracker } from './GPSTracker';
import { ShareRun } from './ShareRun';
import { Badge } from '@/components/ui/badge';

export function RunTracker() {
  const [runs, setRuns] = useLocalStorage<Run[]>('runs', []);
  const [showForm, setShowForm] = useState(false);
  const [showGPSTracker, setShowGPSTracker] = useState(false);
  const [selectedRunForShare, setSelectedRunForShare] = useState<Run | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    notes: ''
  });

  const calculatePace = (distance: number, duration: number) => {
    return duration / distance; // min/km
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distance = parseFloat(formData.distance);
    const duration = parseFloat(formData.duration);
    
    if (distance > 0 && duration > 0) {
      const newRun: Run = {
        id: Date.now().toString(),
        date: formData.date,
        distance,
        duration,
        pace: calculatePace(distance, duration),
        notes: formData.notes,
        calories: Math.round(distance * 60), // estimativa simples
        isPublic: false,
      };
      
      setRuns([newRun, ...runs]);
      setFormData({ date: new Date().toISOString().split('T')[0], distance: '', duration: '', notes: '' });
      setShowForm(false);
    }
  };

  const handleGPSRunComplete = (data: {
    distance: number;
    duration: number;
    gpsRoute: any[];
    elevationGain: number;
    maxSpeed: number;
    avgSpeed: number;
  }) => {
    const newRun: Run = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      distance: data.distance,
      duration: data.duration,
      pace: calculatePace(data.distance, data.duration),
      calories: Math.round(data.distance * 60),
      gpsRoute: data.gpsRoute,
      elevationGain: data.elevationGain,
      maxSpeed: data.maxSpeed,
      avgSpeed: data.avgSpeed,
      isPublic: false,
    };
    
    setRuns([newRun, ...runs]);
    setShowGPSTracker(false);
  };

  const handleShare = (runId: string, isPublic: boolean) => {
    setRuns(runs.map(run => 
      run.id === runId 
        ? { ...run, isPublic, shareUrl: isPublic ? `/share/${runId}` : undefined }
        : run
    ));
  };

  const deleteRun = (id: string) => {
    setRuns(runs.filter(run => run.id !== id));
    if (selectedRunForShare?.id === id) {
      setSelectedRunForShare(null);
    }
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Minhas Corridas</h2>
          <p className="text-sm text-gray-600">Registre e acompanhe suas corridas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setShowGPSTracker(!showGPSTracker);
              setShowForm(false);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">GPS</span>
          </Button>
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setShowGPSTracker(false);
            }}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Corrida</span>
          </Button>
        </div>
      </div>

      {/* GPS Tracker */}
      {showGPSTracker && (
        <GPSTracker onRunComplete={handleGPSRunComplete} />
      )}

      {/* Formulário Manual */}
      {showForm && (
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle>Registrar Corrida Manualmente</CardTitle>
            <CardDescription>Adicione os detalhes da sua corrida</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distância (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Tempo (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.1"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Como foi a corrida?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-600">
                  Salvar Corrida
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Compartilhar Corrida Selecionada */}
      {selectedRunForShare && (
        <ShareRun 
          run={selectedRunForShare} 
          onShare={handleShare}
        />
      )}

      {/* Lista de Corridas */}
      <div className="grid grid-cols-1 gap-4">
        {runs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nenhuma corrida registrada</h3>
                <p className="text-sm text-gray-600 mt-1">Comece registrando sua primeira corrida com GPS ou manualmente!</p>
              </div>
            </div>
          </Card>
        ) : (
          runs.map((run) => (
            <Card key={run.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(run.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {run.duration.toFixed(0)} min
                    </div>
                    {run.gpsRoute && run.gpsRoute.length > 0 && (
                      <Badge className="bg-green-500 text-white border-0">
                        <MapPin className="w-3 h-3 mr-1" />
                        GPS
                      </Badge>
                    )}
                    {run.isPublic && (
                      <Badge className="bg-blue-500 text-white border-0">
                        Público
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedRunForShare(selectedRunForShare?.id === run.id ? null : run)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRun(run.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Distância</p>
                    <p className="text-xl font-bold text-orange-600">{run.distance.toFixed(2)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Ritmo</p>
                    <p className="text-xl font-bold text-pink-600">{formatPace(run.pace)} /km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Calorias</p>
                    <p className="text-xl font-bold text-purple-600">{run.calories} kcal</p>
                  </div>
                  {run.avgSpeed && (
                    <div>
                      <p className="text-xs text-gray-600">Vel. Média</p>
                      <p className="text-xl font-bold text-cyan-600">{run.avgSpeed.toFixed(1)} km/h</p>
                    </div>
                  )}
                </div>

                {/* Dados GPS adicionais */}
                {run.gpsRoute && run.gpsRoute.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Pontos GPS</p>
                        <p className="text-sm font-semibold text-gray-900">{run.gpsRoute.length}</p>
                      </div>
                    </div>
                    {run.elevationGain !== undefined && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Elevação</p>
                          <p className="text-sm font-semibold text-gray-900">{run.elevationGain.toFixed(0)} m</p>
                        </div>
                      </div>
                    )}
                    {run.maxSpeed !== undefined && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Vel. Máx</p>
                          <p className="text-sm font-semibold text-gray-900">{run.maxSpeed.toFixed(1)} km/h</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {run.notes && (
                  <p className="mt-3 text-sm text-gray-700 italic">{run.notes}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
