'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle, Link2, Globe } from 'lucide-react';
import { Run } from '@/lib/types';

interface ShareRunProps {
  run: Run;
  onShare: (runId: string, isPublic: boolean) => void;
}

export function ShareRun({ run, onShare }: ShareRunProps) {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(run.isPublic || false);

  // Gerar URL de compartilhamento
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/share/${run.id}`
    : '';

  // Formatar dados da corrida para compartilhamento
  const formatRunData = () => {
    const pace = run.pace.toFixed(2);
    const distance = run.distance.toFixed(2);
    const duration = run.duration;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const timeStr = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

    return {
      title: `🏃‍♂️ Corrida de ${distance}km no RunPro`,
      description: `Completei ${distance}km em ${timeStr} com pace de ${pace} min/km!`,
      hashtags: ['RunPro', 'Corrida', 'Running', 'Fitness'],
    };
  };

  const runData = formatRunData();

  // Copiar link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Compartilhar no Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Compartilhar no Twitter
  const shareOnTwitter = () => {
    const text = `${runData.description} ${runData.hashtags.map(h => `#${h}`).join(' ')}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Compartilhar no WhatsApp
  const shareOnWhatsApp = () => {
    const text = `${runData.description}\n\nVeja minha corrida: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Compartilhar via Web Share API (mobile) - COM TRATAMENTO DE ERRO ADEQUADO
  const shareNative = async () => {
    // Verificar se Web Share API está disponível
    if (!navigator.share) {
      // Fallback: copiar link se Web Share não estiver disponível
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: runData.title,
        text: runData.description,
        url: shareUrl,
      });
    } catch (err: any) {
      // Tratar erros específicos
      if (err.name === 'NotAllowedError') {
        // Usuário cancelou ou negou permissão - não fazer nada (comportamento esperado)
        console.log('Compartilhamento cancelado pelo usuário');
      } else if (err.name === 'AbortError') {
        // Usuário fechou o diálogo - não fazer nada
        console.log('Compartilhamento abortado');
      } else {
        // Outros erros - fallback para copiar link
        console.error('Erro ao compartilhar:', err);
        await copyLink();
      }
    }
  };

  // Toggle público/privado
  const togglePublic = () => {
    const newPublicState = !isPublic;
    setIsPublic(newPublicState);
    onShare(run.id, newPublicState);
  };

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Share2 className="w-5 h-5 text-orange-600" />
          Compartilhar Corrida
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Público/Privado */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-900">Visibilidade</p>
              <p className="text-xs text-gray-600">
                {isPublic ? 'Qualquer pessoa pode ver' : 'Apenas você pode ver'}
              </p>
            </div>
          </div>
          <Button
            onClick={togglePublic}
            variant={isPublic ? 'default' : 'outline'}
            className={isPublic ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white' : ''}
          >
            {isPublic ? 'Público' : 'Privado'}
          </Button>
        </div>

        {isPublic && (
          <>
            {/* Preview da corrida */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{runData.title}</h3>
              <p className="text-gray-700 mb-3">{runData.description}</p>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{run.distance.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">km</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{run.pace.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">min/km</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{run.duration}</p>
                  <p className="text-xs text-gray-600">min</p>
                </div>
              </div>

              {run.gpsRoute && run.gpsRoute.length > 0 && (
                <Badge className="bg-green-500 text-white border-0">
                  📍 Com rota GPS
                </Badge>
              )}
            </div>

            {/* Link de compartilhamento */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Link de compartilhamento</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                />
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Botões de compartilhamento */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Compartilhar em:</p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Web Share API (mobile) */}
                {typeof navigator !== 'undefined' && navigator.share && (
                  <Button
                    onClick={shareNative}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:opacity-90"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                )}

                {/* Facebook */}
                <Button
                  onClick={shareOnFacebook}
                  className="bg-[#1877F2] text-white hover:bg-[#166FE5]"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>

                {/* Twitter */}
                <Button
                  onClick={shareOnTwitter}
                  className="bg-[#1DA1F2] text-white hover:bg-[#1A91DA]"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>

                {/* WhatsApp */}
                <Button
                  onClick={shareOnWhatsApp}
                  className="bg-[#25D366] text-white hover:bg-[#20BD5A]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>

                {/* Copiar Link */}
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="border-2 border-orange-300 hover:bg-orange-50"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Dica:</strong> Compartilhe suas conquistas e inspire outros corredores!
              </p>
            </div>
          </>
        )}

        {!isPublic && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              Torne esta corrida pública para compartilhar com amigos e a comunidade.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
