import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface OutputData {
  totalOutput: number;
  outputUnit: string;
  portions: number;
}

interface OutputProps {
  output: OutputData;
  onChange: (output: OutputData) => void;
  onNext: () => void;
  onBack: () => void;
}

const OUTPUT_UNITS = ['г', 'кг', 'мл', 'л', 'шт'];

export function Output({ output, onChange, onNext, onBack }: OutputProps) {
  const canProceed = output.totalOutput > 0 && output.portions > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3>Выход готового изделия</h3>

        <div className="space-y-2">
          <Label htmlFor="total-output">Общий выход</Label>
          <div className="flex gap-2">
            <Input
              id="total-output"
              type="number"
              placeholder="Например: 2"
              value={output.totalOutput || ''}
              onChange={(e) => onChange({ ...output, totalOutput: Number(e.target.value) })}
            />
            <Select value={output.outputUnit} onValueChange={(value) => onChange({ ...output, outputUnit: value })}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portions">Количество порций</Label>
          <Input
            id="portions"
            type="number"
            placeholder="Например: 8"
            value={output.portions || ''}
            onChange={(e) => onChange({ ...output, portions: Number(e.target.value) })}
          />
          <p className="text-muted-foreground">Сколько кусочков/порций можно получить</p>
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
