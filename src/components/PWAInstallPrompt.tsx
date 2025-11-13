import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Download, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    // Проверяем, показывали ли уже приветственный диалог
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    // Показываем приветственный диалог только при первом посещении
    if (!hasSeenWelcome) {
      // Задержка для лучшего UX
      setTimeout(() => {
        setShowWelcomeDialog(true);
        localStorage.setItem('hasSeenWelcome', 'true');
      }, 1500);
    }

    // Обработчик события установки PWA
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Если еще не показывали приветствие, показываем стандартный промпт
      if (hasSeenWelcome) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Если нет deferred prompt, просто закрываем диалог
      setShowWelcomeDialog(false);
      setShowPrompt(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setShowWelcomeDialog(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowWelcomeDialog(false);
  };

  // Приветственный диалог для первого посещения
  if (showWelcomeDialog) {
    return (
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Установите приложение легко в одно касание
            </DialogTitle>
            <DialogDescription className="text-center">
              Добавьте &quot;Сладкий расчёт&quot; на главный экран для удобства
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4 text-muted-foreground">
            <p>
              Добавьте &quot;Сладкий расчёт&quot; на главный экран вашего устройства для:
            </p>
            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Быстрого доступа без открытия браузера</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Работы без интернета</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Сохранения всех ваших расчётов</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            {deferredPrompt ? (
              <Button onClick={handleInstall} className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Установить сейчас
              </Button>
            ) : (
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p>
                  Для установки используйте меню браузера:
                </p>
                <p className="text-xs">
                  <strong>Android:</strong> Меню → &quot;Установить приложение&quot;<br />
                  <strong>iOS:</strong> Поделиться → &quot;На экран Домой&quot;
                </p>
              </div>
            )}
            <Button onClick={handleDismiss} variant="ghost" className="w-full">
              Продолжить в браузере
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Стандартный промпт установки (при событии beforeinstallprompt)
  if (!showPrompt) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Установить приложение?</DialogTitle>
          <DialogDescription>
            Добавьте &quot;Сладкий расчёт&quot; на главный экран для быстрого доступа и работы без интернета
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4">
          <Button onClick={handleInstall} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Установить
          </Button>
          <Button onClick={handleDismiss} variant="outline" className="flex-1">
            Позже
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}