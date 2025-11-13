import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

export interface Labor {
  hours: number;
  rate: number;
  workers: number;
}

interface LaborCostsProps {
  labor: Labor;
  onChange: (labor: Labor) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LaborCosts({ labor, onChange, onNext, onBack }: LaborCostsProps) {
  const canProceed = labor.hours > 0 && labor.rate > 0 && labor.workers > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3>Затраты на труд</h3>

        <div className="space-y-2">
          <Label htmlFor="hours">Часы работы</Label>
          <Input
            id="hours"
            type="number"
            placeholder="Например: 4"
            value={labor.hours || ''}
            onChange={(e) => onChange({ ...labor, hours: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Ставка в час (₽)</Label>
          <Input
            id="rate"
            type="number"
            placeholder="Например: 500"
            value={labor.rate || ''}
            onChange={(e) => onChange({ ...labor, rate: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workers">Количество работников</Label>
          <Input
            id="workers"
            type="number"
            placeholder="Например: 1"
            value={labor.workers || ''}
            onChange={(e) => onChange({ ...labor, workers: Number(e.target.value) })}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Итого затраты на труд:</span>
            <span>{(labor.hours * labor.rate * labor.workers).toFixed(2)} ₽</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Назад
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
