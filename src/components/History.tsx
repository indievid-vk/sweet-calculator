import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CalculationResult } from './Calculation';
import { CalculationDetails } from './CalculationDetails';
import { Trash2, Plus, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface HistoryProps {
  calculations: CalculationResult[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onNewCalculation: () => void;
}

export function History({ calculations, onDelete, onEdit, onNewCalculation }: HistoryProps) {
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  if (calculations.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">
          У вас пока нет сохранённых расчётов
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Мои расчёты</h2>
        <Button onClick={onNewCalculation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Новый
        </Button>
      </div>

      <div className="space-y-3">
        {calculations.map((calc) => (
          <Collapsible
            key={calc.id}
            open={openDetails === calc.id}
            onOpenChange={(isOpen) => setOpenDetails(isOpen ? calc.id : null)}
          >
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <CollapsibleTrigger asChild>
                    <button className="flex-1 text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <h4>{calc.recipe.name}</h4>
                        {openDetails === calc.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {new Date(calc.date).toLocaleDateString('ru-RU')}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Себестоимость:</span>
                          <br />
                          <span>{calc.totalCost.toFixed(2)} ₽</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Цена продажи:</span>
                          <br />
                          <span>{calc.sellingPrice.toFixed(2)} ₽</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">За порцию:</span>
                          <br />
                          <span>{calc.pricePerPortion.toFixed(2)} ₽</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Прибыль:</span>
                          <br />
                          <span className="text-primary">
                            +{(calc.sellingPrice - calc.totalCost).toFixed(2)} ₽
                          </span>
                        </div>
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => onEdit(calc.id)} size="icon" variant="ghost" title="Редактировать">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => onDelete(calc.id)} size="icon" variant="ghost" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="pt-3 border-t">
                    <CalculationDetails calculation={calc} />
                  </div>
                </CollapsibleContent>
              </div>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
