'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Training } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Zap, Target, TrendingUp } from 'lucide-react';

const trainingPlans: Training[] = [
  {
    id: '1',
    title: 'Corrida Leve de Recuperação',
    description: 'Corrida em ritmo confortável para recuperação ativa',
    level: 'beginner',
    duration: 20,
    type: 'recovery'
  },
  {
    id: '2',
    title: 'Intervalado 5x1km',
    description: '5 repetições de 1km em ritmo forte com 2min de descanso',
    level: 'intermediate',
    duration: 45,
    type: 'interval'
  },
  {
    id: '3',
    title: 'Long Run 10km',
    description: 'Corrida longa em ritmo moderado para resistência',
    level: 'intermediate',
    duration: 60,
    type: 'long'
  },
  {
    id: '4',
    title: 'Tempo Run 30min',
    description: '30 minutos em ritmo de prova (limiar anaeróbico)',
    level: 'advanced',
    duration: 40,
    type: 'tempo'
  },
  {
    id: '5',
    title: 'Fartlek 40min',
    description: 'Variações de ritmo: 2min forte, 2min leve, repetir',
    level: 'intermediate',
    duration: 40,
    type: 'interval'
  },
  {
    id: '6',
    title: 'Corrida Base 5km',
    description: 'Corrida em ritmo confortável para iniciantes',
    level: 'beginner',
    duration: 30,
    type: 'recovery'
  },
  {
    id: '7',
    title: 'Progressiva 8km',
    description: 'Comece devagar e acelere gradualmente até o final',
    level: 'advanced',
    duration: 50,
    type: 'tempo'
  },
  {
    id: '8',
    title: 'Tiros Curtos 10x400m',
    description: '10 repetições de 400m em ritmo de 5km com 90s descanso',
    level: 'advanced',
    duration: 50,
    type: 'interval'
  }
];

export function TrainingPlans() {
  const [userLevel, setUserLevel] = useLocalStorage<'beginner' | 'intermediate' | 'advanced'>('userLevel', 'beginner');
  const [completedTrainings, setCompletedTrainings] = useLocalStorage<string[]>('completedTrainings', []);

  const filteredTrainings = trainingPlans.filter(t => t.level === userLevel);

  const toggleComplete = (id: string) => {
    if (completedTrainings.includes(id)) {
      setCompletedTrainings(completedTrainings.filter(t => t !== id));
    } else {
      setCompletedTrainings([...completedTrainings, id]);
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700 border-green-300',
      intermediate: 'bg-orange-100 text-orange-700 border-orange-300',
      advanced: 'bg-red-100 text-red-700 border-red-300'
    };
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{labels[level as keyof typeof labels]}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interval': return <Zap className="w-4 h-4" />;
      case 'long': return <Target className="w-4 h-4" />;
      case 'tempo': return <TrendingUp className="w-4 h-4" />;
      case 'recovery': return <Circle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      interval: 'Intervalado',
      long: 'Long Run',
      tempo: 'Tempo Run',
      recovery: 'Recuperação'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Treinos Personalizados</h2>
        <p className="text-sm text-gray-600">Escolha treinos adequados ao seu nível</p>
      </div>

      <Card className="border-2 border-white bg-black text-white">
        <CardHeader>
          <CardTitle className="text-white">Seu Nível</CardTitle>
          <CardDescription className="text-gray-300">Selecione seu nível atual de corrida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={userLevel === 'beginner' ? 'default' : 'outline'}
              onClick={() => setUserLevel('beginner')}
              className={userLevel === 'beginner' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Iniciante
            </Button>
            <Button
              variant={userLevel === 'intermediate' ? 'default' : 'outline'}
              onClick={() => setUserLevel('intermediate')}
              className={userLevel === 'intermediate' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Intermediário
            </Button>
            <Button
              variant={userLevel === 'advanced' ? 'default' : 'outline'}
              onClick={() => setUserLevel('advanced')}
              className={userLevel === 'advanced' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Avançado
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrainings.map((training) => {
          const isCompleted = completedTrainings.includes(training.id);
          return (
            <Card 
              key={training.id} 
              className={`hover:shadow-lg transition-all ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getLevelBadge(training.level)}
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(training.type)}
                        {getTypeLabel(training.type)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleComplete(training.id)}
                    className={isCompleted ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </Button>
                </div>
                <CardDescription className="mt-2">{training.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{training.duration} minutos</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Dica:</strong> Varie seus treinos entre intervalados, longos e recuperação para melhor desenvolvimento. 
            Descanse adequadamente entre treinos intensos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
