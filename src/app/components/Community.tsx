'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CommunityPost, Run } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, Users, Crown, MapPin, Zap, TrendingUp } from 'lucide-react';

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Maria Silva',
    content: 'Acabei de completar minha primeira meia maratona! 21km em 2h15min. Estou muito feliz! 🏃‍♀️🎉',
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPremium: true
  },
  {
    id: '2',
    author: 'João Santos',
    content: 'Dica para iniciantes: não tentem correr rápido demais no começo. Foquem em completar a distância primeiro, a velocidade vem com o tempo! 💪',
    likes: 45,
    comments: 12,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isPremium: false
  },
  {
    id: '3',
    author: 'Ana Costa',
    content: 'Alguém tem dicas de tênis para corrida em asfalto? Estou procurando algo com boa amortecimento.',
    likes: 18,
    comments: 15,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isPremium: true
  },
  {
    id: '4',
    author: 'Pedro Lima',
    content: 'Treino de hoje: 10x400m com 90s de descanso. Melhorei meu tempo em 5 segundos! A consistência compensa! 🔥',
    likes: 32,
    comments: 6,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isPremium: false
  }
];

export function Community() {
  const [posts, setPosts] = useLocalStorage<CommunityPost[]>('communityPosts', initialPosts);
  const [runs] = useLocalStorage<Run[]>('runs', []);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useLocalStorage<string[]>('likedPosts', []);
  const [selectedRunToShare, setSelectedRunToShare] = useState<string | null>(null);

  const handlePost = () => {
    if (newPost.trim()) {
      const sharedRun = selectedRunToShare 
        ? runs.find(r => r.id === selectedRunToShare && r.isPublic)
        : undefined;

      const post: CommunityPost = {
        id: Date.now().toString(),
        author: 'Você',
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        isPremium: false,
        sharedRun
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setSelectedRunToShare(null);
    }
  };

  const toggleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora há pouco';
    if (diffHours === 1) return 'Há 1 hora';
    if (diffHours < 24) return `Há ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Há 1 dia';
    return `Há ${diffDays} dias`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const publicRuns = runs.filter(r => r.isPublic);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Comunidade
          </h2>
          <p className="text-sm text-gray-600">Conecte-se com outros corredores</p>
        </div>
      </div>

      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle>Compartilhe sua experiência</CardTitle>
          <CardDescription>Conte para a comunidade sobre suas corridas e conquistas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="O que você quer compartilhar?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            className="resize-none"
          />

          {/* Selecionar corrida pública para compartilhar */}
          {publicRuns.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Anexar corrida (opcional):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {publicRuns.slice(0, 4).map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRunToShare(selectedRunToShare === run.id ? null : run.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedRunToShare === run.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600">
                        {new Date(run.date).toLocaleDateString('pt-BR')}
                      </p>
                      {run.gpsRoute && (
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          GPS
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Distância</p>
                        <p className="text-sm font-bold text-orange-600">{run.distance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Pace</p>
                        <p className="text-sm font-bold text-pink-600">{formatPace(run.pace)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Publicar
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-600">
                  <AvatarFallback className="text-white font-bold">
                    {getInitials(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    {post.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{getTimeAgo(post.timestamp)}</p>
                  <p className="text-gray-800 mb-4">{post.content}</p>

                  {/* Corrida compartilhada */}
                  {post.sharedRun && (
                    <div className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border-2 border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <p className="text-sm font-semibold text-gray-900">Corrida compartilhada</p>
                        <p className="text-xs text-gray-600">
                          {new Date(post.sharedRun.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <div>
                          <p className="text-xs text-gray-600">Distância</p>
                          <p className="text-lg font-bold text-orange-600">
                            {post.sharedRun.distance.toFixed(2)} km
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Pace</p>
                          <p className="text-lg font-bold text-pink-600">
                            {formatPace(post.sharedRun.pace)} /km
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Tempo</p>
                          <p className="text-lg font-bold text-purple-600">
                            {post.sharedRun.duration} min
                          </p>
                        </div>
                      </div>

                      {post.sharedRun.gpsRoute && post.sharedRun.gpsRoute.length > 0 && (
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span>{post.sharedRun.gpsRoute.length} pontos GPS</span>
                          </div>
                          {post.sharedRun.elevationGain !== undefined && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span>{post.sharedRun.elevationGain.toFixed(0)}m elevação</span>
                            </div>
                          )}
                          {post.sharedRun.maxSpeed !== undefined && (
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-green-600" />
                              <span>{post.sharedRun.maxSpeed.toFixed(1)} km/h máx</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={likedPosts.includes(post.id) ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-700'}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Dica:</strong> Seja respeitoso e motivador com outros corredores. 
            Compartilhe suas experiências e aprenda com a comunidade!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
