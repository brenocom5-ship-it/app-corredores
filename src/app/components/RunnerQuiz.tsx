'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Target, 
  Clock, 
  TrendingUp, 
  Heart,
  Zap,
  Mountain,
  Trophy,
  CheckCircle2,
  User,
  Calendar,
  AlertCircle,
  CreditCard,
  Crown,
  Check
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type?: 'text' | 'date' | 'number' | 'select';
  options?: {
    text: string;
    value: string;
    icon: React.ReactNode;
  }[];
}

interface RunnerProfile {
  type: string;
  title: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
  icon: React.ReactNode;
  color: string;
}

interface UserBasicInfo {
  name: string;
  age: string;
  birthdate: string;
  mainInsecurity: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Qual é o seu nome?',
    type: 'text',
  },
  {
    id: 2,
    question: 'Qual é a sua idade?',
    type: 'number',
  },
  {
    id: 3,
    question: 'Qual é a sua data de nascimento?',
    type: 'date',
  },
  {
    id: 4,
    question: 'Qual é a sua principal insegurança em relação à corrida?',
    type: 'text',
  },
  {
    id: 5,
    question: 'Qual é o seu principal objetivo com a corrida?',
    options: [
      { text: 'Perder peso e melhorar a saúde', value: 'health', icon: <Heart className="w-5 h-5" /> },
      { text: 'Competir e melhorar tempos', value: 'competitive', icon: <Trophy className="w-5 h-5" /> },
      { text: 'Relaxar e aliviar o estresse', value: 'recreational', icon: <Activity className="w-5 h-5" /> },
      { text: 'Desafios e longas distâncias', value: 'endurance', icon: <Mountain className="w-5 h-5" /> },
    ],
  },
  {
    id: 6,
    question: 'Com que frequência você corre atualmente?',
    options: [
      { text: 'Estou começando agora', value: 'beginner', icon: <Zap className="w-5 h-5" /> },
      { text: '1-2 vezes por semana', value: 'occasional', icon: <Clock className="w-5 h-5" /> },
      { text: '3-4 vezes por semana', value: 'regular', icon: <Target className="w-5 h-5" /> },
      { text: '5+ vezes por semana', value: 'frequent', icon: <TrendingUp className="w-5 h-5" /> },
    ],
  },
  {
    id: 7,
    question: 'Qual distância você prefere correr?',
    options: [
      { text: 'Até 5km', value: 'short', icon: <Activity className="w-5 h-5" /> },
      { text: '5km a 10km', value: 'medium', icon: <Target className="w-5 h-5" /> },
      { text: '10km a 21km (meia maratona)', value: 'long', icon: <Mountain className="w-5 h-5" /> },
      { text: 'Maratona (42km) ou mais', value: 'ultra', icon: <Trophy className="w-5 h-5" /> },
    ],
  },
  {
    id: 8,
    question: 'Como você descreveria seu ritmo de corrida?',
    options: [
      { text: 'Leve e confortável (>7 min/km)', value: 'easy', icon: <Heart className="w-5 h-5" /> },
      { text: 'Moderado (6-7 min/km)', value: 'moderate', icon: <Activity className="w-5 h-5" /> },
      { text: 'Rápido (5-6 min/km)', value: 'fast', icon: <Zap className="w-5 h-5" /> },
      { text: 'Muito rápido (<5 min/km)', value: 'veryfast', icon: <Trophy className="w-5 h-5" /> },
    ],
  },
  {
    id: 9,
    question: 'Qual é sua experiência com corrida?',
    options: [
      { text: 'Iniciante (menos de 6 meses)', value: 'novice', icon: <Zap className="w-5 h-5" /> },
      { text: 'Intermediário (6 meses a 2 anos)', value: 'intermediate', icon: <Target className="w-5 h-5" /> },
      { text: 'Avançado (2 a 5 anos)', value: 'advanced', icon: <TrendingUp className="w-5 h-5" /> },
      { text: 'Experiente (mais de 5 anos)', value: 'expert', icon: <Trophy className="w-5 h-5" /> },
    ],
  },
];

const runnerProfiles: Record<string, RunnerProfile> = {
  recreational: {
    type: 'recreational',
    title: 'Corredor Recreativo',
    description: 'Você corre pelo prazer e bem-estar, sem pressão por performance.',
    characteristics: [
      'Foco em saúde e qualidade de vida',
      'Ritmo confortável e prazeroso',
      'Flexibilidade nos treinos',
      'Corrida como momento de relaxamento',
    ],
    recommendations: [
      'Mantenha a consistência sem pressão',
      'Varie os percursos para manter o interesse',
      'Combine corrida com outras atividades',
      'Ouça seu corpo e respeite os limites',
    ],
    icon: <Heart className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-600',
  },
  competitive: {
    type: 'competitive',
    title: 'Corredor Competitivo',
    description: 'Você busca constantemente melhorar seus tempos e competir.',
    characteristics: [
      'Foco em performance e resultados',
      'Treinos estruturados e periodizados',
      'Participação regular em provas',
      'Mentalidade de superação',
    ],
    recommendations: [
      'Siga um plano de treino periodizado',
      'Inclua treinos de velocidade e intervalados',
      'Monitore métricas de desempenho',
      'Participe de provas para testar evolução',
    ],
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-orange-500 to-red-600',
  },
  endurance: {
    type: 'endurance',
    title: 'Corredor de Resistência',
    description: 'Você ama desafios de longa distância e ultramaratonas.',
    characteristics: [
      'Paixão por longas distâncias',
      'Resistência mental e física',
      'Treinos de volume alto',
      'Foco em nutrição e recuperação',
    ],
    recommendations: [
      'Aumente volume gradualmente',
      'Priorize recuperação e nutrição',
      'Treine em diferentes terrenos',
      'Desenvolva resistência mental',
    ],
    icon: <Mountain className="w-8 h-8" />,
    color: 'from-purple-500 to-indigo-600',
  },
  health: {
    type: 'health',
    title: 'Corredor Focado em Saúde',
    description: 'Você corre principalmente para melhorar sua saúde e bem-estar.',
    characteristics: [
      'Objetivo de perder peso ou manter forma',
      'Foco em saúde cardiovascular',
      'Ritmo moderado e sustentável',
      'Integração com alimentação saudável',
    ],
    recommendations: [
      'Combine corrida com alimentação balanceada',
      'Monitore frequência cardíaca',
      'Progrida gradualmente',
      'Celebre pequenas conquistas',
    ],
    icon: <Heart className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-600',
  },
  beginner: {
    type: 'beginner',
    title: 'Corredor Iniciante',
    description: 'Você está começando sua jornada na corrida.',
    characteristics: [
      'Construindo base aeróbica',
      'Aprendendo técnicas básicas',
      'Desenvolvendo consistência',
      'Descobrindo seu ritmo',
    ],
    recommendations: [
      'Comece devagar e progrida gradualmente',
      'Alterne caminhada e corrida',
      'Invista em um bom tênis',
      'Seja paciente com seu progresso',
    ],
    icon: <Zap className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-600',
  },
  balanced: {
    type: 'balanced',
    title: 'Corredor Equilibrado',
    description: 'Você equilibra performance, saúde e prazer na corrida.',
    characteristics: [
      'Abordagem balanceada',
      'Treinos variados',
      'Foco em consistência',
      'Objetivos realistas',
    ],
    recommendations: [
      'Mantenha variedade nos treinos',
      'Estabeleça metas alcançáveis',
      'Equilibre intensidade e recuperação',
      'Aproveite o processo',
    ],
    icon: <Target className="w-8 h-8" />,
    color: 'from-indigo-500 to-purple-600',
  },
};

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: [
      'Rastreamento básico de corridas',
      'Histórico de 30 dias',
      'Calculadora de eletrólitos',
      'Análise básica de performance',
    ],
    color: 'from-gray-500 to-gray-600',
    icon: <Activity className="w-6 h-6" />,
  },
  {
    name: 'Básico',
    price: 'R$ 19,90',
    period: '/mês',
    popular: false,
    features: [
      'Tudo do plano Gratuito',
      'Histórico ilimitado',
      'Planos de treino personalizados',
      'Análise avançada de performance',
      'Comunidade de corredores',
    ],
    color: 'from-blue-500 to-blue-600',
    icon: <Target className="w-6 h-6" />,
  },
  {
    name: 'Premium',
    price: 'R$ 39,90',
    period: '/mês',
    popular: true,
    features: [
      'Tudo do plano Básico',
      'Coaching personalizado com IA',
      'Análise biomecânica avançada',
      'Integração com wearables',
      'Suporte prioritário',
      'Acesso antecipado a novos recursos',
    ],
    color: 'from-orange-500 to-pink-600',
    icon: <Crown className="w-6 h-6" />,
  },
];

interface RunnerQuizProps {
  onComplete: (profile: RunnerProfile, userName: string) => void;
}

export function RunnerQuiz({ onComplete }: RunnerQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [textInput, setTextInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [profile, setProfile] = useState<RunnerProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UserBasicInfo>({
    name: '',
    age: '',
    birthdate: '',
    mainInsecurity: '',
  });

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQ = questions[currentQuestion];

  const handleTextAnswer = () => {
    if (!textInput.trim()) return;

    const newAnswers = { ...answers, [currentQ.id]: textInput };
    setAnswers(newAnswers);

    // Salvar informações básicas do usuário
    if (currentQ.id === 1) setUserInfo(prev => ({ ...prev, name: textInput }));
    if (currentQ.id === 2) setUserInfo(prev => ({ ...prev, age: textInput }));
    if (currentQ.id === 3) setUserInfo(prev => ({ ...prev, birthdate: textInput }));
    if (currentQ.id === 4) setUserInfo(prev => ({ ...prev, mainInsecurity: textInput }));

    setTextInput('');

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const calculatedProfile = calculateProfile(newAnswers);
        setProfile(calculatedProfile);
        setShowResult(true);
      }, 300);
    }
  };

  const handleOptionAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const calculatedProfile = calculateProfile(newAnswers);
        setProfile(calculatedProfile);
        setShowResult(true);
      }, 300);
    }
  };

  const calculateProfile = (userAnswers: Record<number, string>): RunnerProfile => {
    const goalAnswer = userAnswers[5];
    const frequencyAnswer = userAnswers[6];
    const experienceAnswer = userAnswers[9];

    if (frequencyAnswer === 'beginner' || experienceAnswer === 'novice') {
      return runnerProfiles.beginner;
    }

    if (goalAnswer === 'competitive' && (frequencyAnswer === 'frequent' || frequencyAnswer === 'regular')) {
      return runnerProfiles.competitive;
    }

    if (goalAnswer === 'endurance' || userAnswers[7] === 'ultra' || userAnswers[7] === 'long') {
      return runnerProfiles.endurance;
    }

    if (goalAnswer === 'health') {
      return runnerProfiles.health;
    }

    if (goalAnswer === 'recreational' || frequencyAnswer === 'occasional') {
      return runnerProfiles.recreational;
    }

    return runnerProfiles.balanced;
  };

  const handleContinueToPayment = () => {
    setShowPayment(true);
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleFinishPayment = () => {
    if (profile) {
      // Salvar plano selecionado no localStorage
      localStorage.setItem('subscription', JSON.stringify(selectedPlan));
      onComplete(profile, userInfo.name);
    }
  };

  // Tela de pagamento
  if (showPayment && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-5xl shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CreditCard className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl sm:text-3xl">Escolha seu Plano</CardTitle>
            <CardDescription className="text-center text-white/90 text-base mt-2">
              Selecione o plano ideal para suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectPlan(plan.name.toLowerCase())}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.name.toLowerCase()
                      ? 'scale-105'
                      : 'hover:scale-102'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white border-0 z-10">
                      Mais Popular
                    </Badge>
                  )}
                  <Card className={`h-full border-2 ${
                    selectedPlan === plan.name.toLowerCase()
                      ? 'border-[#FF6B35] shadow-xl'
                      : 'border-gray-200'
                  }`}>
                    <CardHeader className={`bg-gradient-to-r ${plan.color} text-white rounded-t-lg`}>
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          {plan.icon}
                        </div>
                      </div>
                      <CardTitle className="text-center text-xl">{plan.name}</CardTitle>
                      <div className="text-center mt-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm opacity-90">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleFinishPayment}
                className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF5722] hover:to-[#FF7733] text-white h-12 text-base font-semibold"
              >
                {selectedPlan === 'free' ? 'Começar Gratuitamente' : `Assinar Plano ${plans.find(p => p.name.toLowerCase() === selectedPlan)?.name}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela de resultado
  if (showResult && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className={`bg-gradient-to-r ${profile.color} text-white rounded-t-lg`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {profile.icon}
              </div>
            </div>
            <CardTitle className="text-center text-2xl sm:text-3xl">
              Olá, {userInfo.name}! 👋
            </CardTitle>
            <CardDescription className="text-center text-white/90 text-base mt-2">
              {profile.title}
            </CardDescription>
            <p className="text-center text-white/80 text-sm mt-2">
              {profile.description}
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Informações do usuário */}
            <div className="bg-orange-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5 text-[#FF6B35]" />
                Suas Informações
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <span><strong>Idade:</strong> {userInfo.age} anos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <span><strong>Nascimento:</strong> {new Date(userInfo.birthdate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <AlertCircle className="w-4 h-4 text-[#FF6B35] mt-0.5" />
                  <span><strong>Principal insegurança:</strong> {userInfo.mainInsecurity}</span>
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Suas Características
              </h3>
              <div className="grid gap-2">
                {profile.characteristics.map((char, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 mt-2" />
                    <span>{char}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Recomendações para Você
              </h3>
              <div className="grid gap-2">
                {profile.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 mt-2" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleContinueToPayment}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF5722] hover:to-[#FF7733] text-white h-12 text-base font-semibold"
              >
                Continuar para Escolher Plano
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Questão {currentQuestion + 1} de {totalQuestions}
            </Badge>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <CardTitle className="text-xl sm:text-2xl mt-4">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {currentQ.type === 'text' || currentQ.type === 'date' || currentQ.type === 'number' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="answer" className="text-base">
                  {currentQ.type === 'date' ? 'Selecione a data' : 'Digite sua resposta'}
                </Label>
                <Input
                  id="answer"
                  type={currentQ.type}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextAnswer()}
                  placeholder={
                    currentQ.type === 'text' 
                      ? 'Digite aqui...' 
                      : currentQ.type === 'number'
                      ? 'Digite sua idade...'
                      : ''
                  }
                  className="h-12 text-base"
                  autoFocus
                />
              </div>
              <Button
                onClick={handleTextAnswer}
                disabled={!textInput.trim()}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF5722] hover:to-[#FF7733] text-white h-12"
              >
                Continuar
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {currentQ.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionAnswer(option.value)}
                  variant="outline"
                  className="h-auto p-4 justify-start text-left hover:bg-black hover:text-white hover:border-black transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                      {option.icon}
                    </div>
                    <span className="text-sm sm:text-base font-medium">{option.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
