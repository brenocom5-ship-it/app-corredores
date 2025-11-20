'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SubscriptionPlan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, X } from 'lucide-react';

export function SubscriptionModal() {
  const [subscription, setSubscription] = useLocalStorage<SubscriptionPlan>('subscription', 'free');
  const [showModal, setShowModal] = useState(subscription === 'free');

  const plans = [
    {
      id: 'premium' as SubscriptionPlan,
      name: 'Premium',
      price: 'R$ 14,99',
      color: 'from-orange-500 to-pink-600',
      features: [
        'Registro ilimitado de corridas',
        'Calculadora de eletrólitos',
        'Estatísticas avançadas e gráficos',
        'Treinos premium exclusivos',
        'Análise detalhada de desempenho',
        'Suporte prioritário',
        'Badge especial na comunidade'
      ],
      notIncluded: []
    }
  ];

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSubscription(plan);
    setShowModal(false);
  };

  if (!showModal && subscription !== 'free') return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Desbloqueie o Premium</h2>
            <p className="text-gray-600">Leve seu treino para o próximo nível</p>
          </div>

          <div className="flex justify-center mb-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className="relative overflow-hidden border-2 border-[#FF6B35] shadow-xl w-full max-w-md"
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    Recomendado
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} mb-3`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-[#FF6B35]">{plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                  >
                    {subscription === plan.id ? 'Plano Atual' : 'Assinar Agora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {subscription !== 'free' && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Continuar com plano atual
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
