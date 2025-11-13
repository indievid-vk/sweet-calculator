import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import { History as HistoryIcon, Trash2, Edit } from 'lucide-react';
import { CalculationResult } from './Calculation';

interface HistoryDrawerProps {
  calculations: CalculationResult[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function HistoryDrawer({ calculations, onDelete, onEdit }: HistoryDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl relative">
          <HistoryIcon className="w-5 h-5" />
          {calculations.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {calculations.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>История расчётов</SheetTitle>
          <SheetDescription>
            Просмотр и управление сохранёнными расчётами
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {calculations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Пока нет сохранённых расчётов
            </p>
          ) : (
            calculations.map((calc) => (
              <div key={calc.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{calc.recipe.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(calc.date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button onClick={() => onEdit(calc.id)} size="icon" variant="ghost" title="Редактировать">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => onDelete(calc.id)} size="icon" variant="ghost" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Себестоимость:</span>
                    <span>{calc.totalCost.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Цена продажи:</span>
                    <span>{calc.sellingPrice.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Прибыль:</span>
                    <span>+{(calc.sellingPrice - calc.totalCost).toFixed(2)} ₽</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
