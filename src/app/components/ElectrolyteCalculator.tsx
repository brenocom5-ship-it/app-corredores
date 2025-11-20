'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SubscriptionPlan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Flame, ThermometerSun, Lock, Crown } from 'lucide-react';

export function ElectrolyteCalculator() {
  const [subscription] = useLocalStorage<SubscriptionPlan>('subscription', 'free');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [temperature, setTemperature] = useState<'cool' | 'moderate' | 'hot'>('moderate');
  const [result, setResult] = useState<any>(null);

  const isPremium = subscription === 'premium';

  const calculate = () => {
    if (!isPremium) return;
    
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    
    if (w > 0 && d > 0) {
      // Fórmulas baseadas em recomendações esportivas
      let waterBase = (d / 60) * 500; // 500ml por hora base
      let sodiumBase = (d / 60) * 400; // 400mg por hora base
      let potassiumBase = (d / 60) * 100; // 100mg por hora base

      // Ajustes por intensidade
      const intensityMultiplier = intensity === 'low' ? 0.8 : intensity === 'high' ? 1.3 : 1;
      
      // Ajustes por temperatura
      const tempMultiplier = temperature === 'cool' ? 0.9 : temperature === 'hot' ? 1.4 : 1;

      // Ajuste por peso
      const weightMultiplier = w / 70; // 70kg como referência

      const water = Math.round(waterBase * intensityMultiplier * tempMultiplier * weightMultiplier);
      const sodium = Math.round(sodiumBase * intensityMultiplier * tempMultiplier);
      const potassium = Math.round(potassiumBase * intensityMultiplier * tempMultiplier);

      setResult({ water, sodium, potassium });
    }
  };

  // Se não for premium, mostrar tela de bloqueio
  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calculadora de Eletrólitos</h2>
          <p className="text-sm text-gray-600">Calcule suas necessidades de hidratação e eletrólitos</p>
        </div>

        <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Recurso Exclusivo Premium
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              A Calculadora de Eletrólitos é uma funcionalidade exclusiva para assinantes Premium. 
              Calcule suas necessidades precisas de hidratação e eletrólitos para otimizar seu desempenho!
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 max-w-md mx-auto shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Benefícios Premium
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Cálculo personalizado de hidratação baseado em peso e duração</span>
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Recomendações de sódio e potássio ajustadas por intensidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThermometerSun className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Ajustes automáticos baseados na temperatura ambiente</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Dicas personalizadas de nutrição esportiva</span>
                </li>
              </ul>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold shadow-lg"
              onClick={() => {
                // Redirecionar para modal de assinatura
                window.dispatchEvent(new CustomEvent('openSubscriptionModal'));
              }}
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Plano Premium
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              A partir de R$ 29,90/mês
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conteúdo normal para usuários premium
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calculadora de Eletrólitos</h2>
          <p className="text-sm text-gray-600">Calcule suas necessidades de hidratação e eletrólitos</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-full shadow-md">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-semibold">Premium</span>
        </div>
      </div>

      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Dados da Corrida
          </CardTitle>
          <CardDescription>Preencha as informações para calcular</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="intensity">Intensidade</Label>
              <Select value={intensity} onValueChange={(v: any) => setIntensity(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Leve</SelectItem>
                  <SelectItem value="moderate">Moderada</SelectItem>
                  <SelectItem value="high">Intensa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperatura</Label>
              <Select value={temperature} onValueChange={(v: any) => setTemperature(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cool">Frio (&lt;15°C)</SelectItem>
                  <SelectItem value="moderate">Moderado (15-25°C)</SelectItem>
                  <SelectItem value="hot">Quente (&gt;25°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={calculate}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            Calcular
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Água</p>
                  <p className="text-2xl font-bold text-blue-600">{result.water} ml</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Hidrate-se regularmente durante a corrida</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sódio</p>
                  <p className="text-2xl font-bold text-orange-600">{result.sodium} mg</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Essencial para evitar cãibras</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <ThermometerSun className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Potássio</p>
                  <p className="text-2xl font-bold text-purple-600">{result.potassium} mg</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Importante para recuperação muscular</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Dica:</strong> Consuma bebidas isotônicas ou água de coco para repor eletrólitos. 
            Evite esperar sentir sede para se hidratar!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
