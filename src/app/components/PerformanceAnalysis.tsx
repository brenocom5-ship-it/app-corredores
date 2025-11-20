'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Run, Stats } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Clock, Zap, Target, Calendar } from 'lucide-react';
import { useMemo } from 'react';

export function PerformanceAnalysis() {
  const [runs] = useLocalStorage<Run[]>('runs', []);

  const stats: Stats = useMemo(() => {
    if (runs.length === 0) {
      return {
        totalRuns: 0,
        totalDistance: 0,
        totalTime: 0,
        averagePace: 0,
        bestPace: 0,
        thisWeek: { runs: 0, distance: 0 },
        thisMonth: { runs: 0, distance: 0 }
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
    const totalTime = runs.reduce((sum, run) => sum + run.duration, 0);
    const averagePace = totalTime / totalDistance;
    const bestPace = Math.min(...runs.map(r => r.pace));

    const thisWeekRuns = runs.filter(r => new Date(r.date) >= weekAgo);
    const thisMonthRuns = runs.filter(r => new Date(r.date) >= monthAgo);

    return {
      totalRuns: runs.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTime: Math.round(totalTime),
      averagePace: Math.round(averagePace * 100) / 100,
      bestPace: Math.round(bestPace * 100) / 100,
      thisWeek: {
        runs: thisWeekRuns.length,
        distance: Math.round(thisWeekRuns.reduce((sum, r) => sum + r.distance, 0) * 10) / 10
      },
      thisMonth: {
        runs: thisMonthRuns.length,
        distance: Math.round(thisMonthRuns.reduce((sum, r) => sum + r.distance, 0) * 10) / 10
      }
    };
  }, [runs]);

  const formatPace = (pace: number) => {
    if (!pace || pace === Infinity) return '--:--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const recentRuns = runs.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Análise de Desempenho</h2>
        <p className="text-sm text-gray-600">Acompanhe sua evolução e estatísticas</p>
      </div>

      {runs.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sem dados ainda</h3>
              <p className="text-sm text-gray-600 mt-1">Registre corridas para ver suas estatísticas</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Total de Corridas</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalRuns}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Distância Total</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalDistance} km</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Tempo Total</p>
                <p className="text-3xl font-bold text-purple-600">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Ritmo Médio</p>
                <p className="text-3xl font-bold text-green-600">{formatPace(stats.averagePace)} /km</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600">Melhor Ritmo</p>
                <p className="text-3xl font-bold text-yellow-600">{formatPace(stats.bestPace)} /km</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.thisWeek.distance} km</p>
                <p className="text-xs text-gray-600 mt-1">{stats.thisWeek.runs} corridas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Corridas Recentes</CardTitle>
              <CardDescription>Suas últimas 5 corridas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRuns.map((run, index) => (
                  <div key={run.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{new Date(run.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-sm text-gray-600">{run.distance.toFixed(1)} km em {run.duration.toFixed(0)} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{formatPace(run.pace)}</p>
                      <p className="text-xs text-gray-600">min/km</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
