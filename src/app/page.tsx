'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SubscriptionPlan, RunnerProfileType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Droplets, TrendingUp, Dumbbell, Users, Crown, Settings, Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { RunTracker } from './components/RunTracker';
import { ElectrolyteCalculator } from './components/ElectrolyteCalculator';
import { PerformanceAnalysis } from './components/PerformanceAnalysis';
import { TrainingPlans } from './components/TrainingPlans';
import { Community } from './components/Community';
import { SubscriptionModal } from './components/SubscriptionModal';
import { RunnerQuiz } from './components/RunnerQuiz';

type Theme = 'light' | 'dark' | 'system';

export default function Home() {
  const [subscription] = useLocalStorage<SubscriptionPlan>('subscription', 'free');
  const [hasCompletedQuiz, setHasCompletedQuiz] = useLocalStorage<boolean>('hasCompletedQuiz', false);
  const [hasCompletedCheckout, setHasCompletedCheckout] = useLocalStorage<boolean>('hasCompletedCheckout', false);
  const [runnerProfile, setRunnerProfile] = useLocalStorage<RunnerProfileType | null>('runnerProfile', null);
  const [runnerName, setRunnerName] = useLocalStorage<string>('runnerName', '');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('runs');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');

  const handleQuizComplete = (profile: any, userName: string) => {
    const profileData: RunnerProfileType = {
      type: profile.type,
      title: profile.title,
      description: profile.description,
      characteristics: profile.characteristics,
      recommendations: profile.recommendations,
      completedAt: new Date().toISOString(),
    };
    
    setRunnerProfile(profileData);
    setRunnerName(userName);
    setHasCompletedQuiz(true);
  };

  // Aplicar tema
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listener para abrir modal de assinatura
  useEffect(() => {
    const handleOpenModal = () => setShowSubscriptionModal(true);
    window.addEventListener('openSubscriptionModal', handleOpenModal);
    return () => window.removeEventListener('openSubscriptionModal', handleOpenModal);
  }, []);

  // Mostrar quiz se não foi completado
  if (!hasCompletedQuiz) {
    return <RunnerQuiz onComplete={handleQuizComplete} />;
  }

  // Mostrar checkout se quiz foi completado mas checkout não
  if (hasCompletedQuiz && !hasCompletedCheckout) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Finalize sua Inscrição
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete o processo para começar sua jornada no RunPro
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <iframe
              src="https://checkout.keoto.com/9bc82905-83dd-47d9-8618-a7ad8982400f"
              className="w-full h-[600px] border-0"
              title="Checkout"
            />
          </div>


        </div>
      </div>
    );
  }

  const getPlanBadge = () => {
    if (subscription === 'premium') {
      return (
        <Badge className="bg-[#FF6B35] text-white border-0 font-semibold">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    if (subscription === 'basic') {
      return (
        <Badge className="bg-gray-800 text-white border-0 font-semibold">
          Básico
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300">
        Gratuito
      </Badge>
    );
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#FF6B35] rounded-xl shadow-md flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">RunPro</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Seu app de corrida</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getPlanBadge()}
              
              {/* Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-gray-800"
                  >
                    {getThemeIcon()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                    <Sun className="w-4 h-4 mr-2" />
                    Claro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                    <Moon className="w-4 h-4 mr-2" />
                    Escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                    <Monitor className="w-4 h-4 mr-2" />
                    Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubscriptionModal(true)}
                className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-gray-800"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] border-0 text-white shadow-lg overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 animate-pulse">
                    🔥 Bora Correr, {runnerName || 'Campeão'}!
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base font-medium">
                    {runnerProfile?.description || 'Sua jornada épica começa agora!'}
                  </p>
                </div>
                {subscription === 'free' && (
                  <Button
                    onClick={() => setShowSubscriptionModal(true)}
                    size="sm"
                    className="bg-white text-[#FF6B35] hover:bg-gray-50 font-semibold shadow-md whitespace-nowrap"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="runs" className="mt-0">
            <RunTracker />
          </TabsContent>

          <TabsContent value="electrolytes" className="mt-0">
            <ElectrolyteCalculator />
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <PerformanceAnalysis />
          </TabsContent>

          <TabsContent value="training" className="mt-0">
            <TrainingPlans />
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <Community />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation - Estilo da referência */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 shadow-lg transition-colors">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setActiveTab('runs')}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                activeTab === 'runs'
                  ? 'text-[#FF6B35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Activity className={`w-6 h-6 mb-1 ${activeTab === 'runs' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">Corridas</span>
            </button>

            <button
              onClick={() => setActiveTab('electrolytes')}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                activeTab === 'electrolytes'
                  ? 'text-[#FF6B35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Droplets className={`w-6 h-6 mb-1 ${activeTab === 'electrolytes' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">Eletrólitos</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                activeTab === 'analysis'
                  ? 'text-[#FF6B35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <TrendingUp className={`w-6 h-6 mb-1 ${activeTab === 'analysis' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">Análise</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                activeTab === 'training'
                  ? 'text-[#FF6B35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Dumbbell className={`w-6 h-6 mb-1 ${activeTab === 'training' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">Treinos</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                activeTab === 'community'
                  ? 'text-[#FF6B35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className={`w-6 h-6 mb-1 ${activeTab === 'community' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">Comunidade</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Subscription Modal */}
      {showSubscriptionModal && <SubscriptionModal />}
    </div>
  );
}
