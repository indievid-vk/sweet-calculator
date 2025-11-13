import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Calculator, History } from 'lucide-react';
import { UsageGuideDialog } from './UsageGuideDialog';
const heroImage = '/images/hero.png';

interface HomePageProps {
  calculationsCount: number;
  onNewCalculation: () => void;
  onViewCalculations: () => void;
}

export function HomePage({ calculationsCount, onNewCalculation, onViewCalculations }: HomePageProps) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      {/* Героическое изображение - уменьшенное */}
      <div className="w-full max-w-xs">
        <img
          src={heroImage}
          alt="Калькулятор для кондитеров"
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Основные действия */}
      <div className="w-full space-y-3 px-4">
        <Button
          onClick={onNewCalculation}
          size="lg"
          className="w-full rounded-2xl h-14 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Создать новый расчёт
        </Button>

        {calculationsCount > 0 && (
          <Button
            onClick={onViewCalculations}
            size="lg"
            variant="outline"
            className="w-full rounded-2xl h-14"
          >
            <History className="w-5 h-5 mr-2" />
            Мои расчёты ({calculationsCount})
          </Button>
        )}
      </div>

      {/* Интерактивные преимущества */}
      <div className="grid grid-cols-1 gap-3 w-full px-4 pt-2">
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer text-left"
        >
          <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm">Точный расчёт</h4>
            <p className="text-xs text-muted-foreground">
              Автоматический пересчёт единиц измерения и учёт всех затрат
            </p>
          </div>
        </button>

        <button
          onClick={onViewCalculations}
          className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer text-left"
        >
          <History className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm">История расчётов</h4>
            <p className="text-xs text-muted-foreground">
              Все расчёты сохраняются локально и доступны офлайн
            </p>
          </div>
        </button>
      </div>

      {/* Диалог справки */}
      <UsageGuideDialog open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
