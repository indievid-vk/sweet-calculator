import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CalculationResult } from './Calculation';
import { CalculationDetails } from './CalculationDetails';
import { Trash2, Edit, ChevronDown, ChevronUp, Plus, FileDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface MyCalculationsPageProps {
  calculations: CalculationResult[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onNewCalculation: () => void;
}

export function MyCalculationsPage({ calculations, onDelete, onEdit, onNewCalculation }: MyCalculationsPageProps) {
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  // Функция экспорта в CSV (открывается в Excel)
  const exportToExcel = (calc: CalculationResult) => {
    // Создаем CSV контент
    let csvContent = '';
    
    // Функция для экранирования CSV значений
    const escapeCsv = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Экранируем кавычки и оборачиваем в кавычки если есть запятые, переносы строк или кавычки
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // Общая информация
    csvContent += 'ОБЩАЯ ИНФОРМАЦИЯ\n';
    csvContent += `Название,${escapeCsv(calc.recipe.name)}\n`;
    csvContent += `Категория,${escapeCsv(calc.recipe.category)}\n`;
    csvContent += `Дата расчета,${escapeCsv(new Date(calc.date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))}\n`;
    if (calc.recipe.comment) {
      csvContent += `Комментарий,${escapeCsv(calc.recipe.comment)}\n`;
    }
    csvContent += '\n';
    
    // Ингредиенты
    csvContent += 'ИНГРЕДИЕНТЫ\n';
    csvContent += 'Название,Количество,Единица,Продукт при покупке,Цена упаковки,Кол-во в упаковке,Ед. упаковки,Эквивалент,Стоимость\n';
    
    calc.recipe.ingredients.forEach((ing) => {
      const price = calc.prices[ing.name];
      const cost = price ? calculateIngredientCost(ing.amount, ing.unit, price) : 0;
      
      const row = [
        escapeCsv(ing.name),
        escapeCsv(ing.amount),
        escapeCsv(ing.unit),
        escapeCsv(price?.productName || ''),
        escapeCsv(price ? `${price.price} ₽` : ''),
        escapeCsv(price?.priceQuantity || ''),
        escapeCsv(price?.priceUnit || ''),
        escapeCsv(price?.equivalence ? `${price.equivalence.ratio} ${ing.unit} в 1 ${price.priceUnit}` : 'Не требуется'),
        escapeCsv(`${cost.toFixed(2)} ₽`)
      ];
      csvContent += row.join(',') + '\n';
    });
    
    csvContent += `,,,,,,,,${escapeCsv(`${calc.ingredientsCost.toFixed(2)} ₽`)}\n`;
    csvContent += `,,,,,,,ИТОГО:,${escapeCsv(`${calc.ingredientsCost.toFixed(2)} ₽`)}\n`;
    csvContent += '\n';
    
    // Трудозатраты
    csvContent += 'ТРУДОЗАТРАТЫ\n';
    csvContent += 'Параметр,Значение\n';
    csvContent += `Часы работы,${escapeCsv(calc.labor.hours)}\n`;
    csvContent += `Ставка в час,${escapeCsv(`${calc.labor.rate} ₽`)}\n`;
    csvContent += `Количество работников,${escapeCsv(calc.labor.workers)}\n`;
    csvContent += `Стоимость труда,${escapeCsv(`${calc.laborCost.toFixed(2)} ₽`)}\n`;
    csvContent += '\n';
    
    // Выход и расчет
    csvContent += 'ВЫХОД И РАСЧЕТ\n';
    csvContent += 'Параметр,Значение\n';
    csvContent += `Общий выход,${escapeCsv(`${calc.output.totalOutput} ${calc.output.outputUnit}`)}\n`;
    csvContent += `Количество порций,${escapeCsv(calc.output.portions)}\n`;
    csvContent += '\n';
    csvContent += `Себестоимость,${escapeCsv(`${calc.totalCost.toFixed(2)} ₽`)}\n`;
    csvContent += `Наценка,${escapeCsv(`${calc.markup}%`)}\n`;
    csvContent += `Цена продажи,${escapeCsv(`${calc.sellingPrice.toFixed(2)} ₽`)}\n`;
    csvContent += `Цена за порцию,${escapeCsv(`${calc.pricePerPortion.toFixed(2)} ₽`)}\n`;
    csvContent += `Прибыль,${escapeCsv(`${(calc.sellingPrice - calc.totalCost).toFixed(2)} ₽`)}\n`;
    
    // Создаем Blob и скачиваем
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${calc.recipe.name}_${new Date(calc.date).toLocaleDateString('ru-RU').replace(/\./g, '-')}.csv`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Вспомогательная функция для расчета стоимости ингредиента (скопирована из Calculation.tsx)
  const calculateIngredientCost = (
    ingredientAmount: number,
    ingredientUnit: string,
    price: any
  ): number => {
    const { price: totalPrice, priceUnit, priceQuantity, equivalence } = price;
    const pricePerUnit = totalPrice / priceQuantity;

    if (equivalence && equivalence.ratio > 0) {
      const unitsNeeded = ingredientAmount / equivalence.ratio;
      return unitsNeeded * pricePerUnit;
    }

    const convertedAmount = convertUnits(ingredientAmount, ingredientUnit, priceUnit);
    return convertedAmount * pricePerUnit;
  };

  const convertUnits = (amount: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return amount;

    const weightConversions: Record<string, number> = { 'г': 1, 'кг': 1000 };
    const volumeConversions: Record<string, number> = { 'мл': 1, 'л': 1000 };

    if (weightConversions[fromUnit] && weightConversions[toUnit]) {
      return (amount * weightConversions[fromUnit]) / weightConversions[toUnit];
    }

    if (volumeConversions[fromUnit] && volumeConversions[toUnit]) {
      return (amount * volumeConversions[fromUnit]) / volumeConversions[toUnit];
    }

    return amount;
  };

  if (calculations.length === 0) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="space-y-2">
          <h2>У вас пока нет расчётов</h2>
          <p className="text-muted-foreground">
            Создайте первый расчёт, чтобы он появился здесь
          </p>
        </div>
        <Button onClick={onNewCalculation} size="lg" className="rounded-2xl">
          <Plus className="w-5 h-5 mr-2" />
          Создать расчёт
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Мои расчёты</h2>
          <p className="text-muted-foreground text-sm">
            Всего расчётов: {calculations.length}
          </p>
        </div>
        <Button onClick={onNewCalculation} size="sm" className="rounded-xl">
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
            <Card className="overflow-hidden">
              <div className="space-y-0">
                <div className="flex items-start gap-3 p-4">
                  <CollapsibleTrigger asChild>
                    <button className="flex-1 text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="flex-1">{calc.recipe.name}</h4>
                        {openDetails === calc.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(calc.date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Себестоимость</p>
                          <p className="font-medium">{calc.totalCost.toFixed(2)} ₽</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Цена продажи</p>
                          <p className="font-medium">{calc.sellingPrice.toFixed(2)} ₽</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">За порцию</p>
                          <p className="font-medium">{calc.pricePerPortion.toFixed(2)} ₽</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Прибыль</p>
                          <p className="font-medium text-primary">
                            +{(calc.sellingPrice - calc.totalCost).toFixed(2)} ₽
                          </p>
                        </div>
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        exportToExcel(calc);
                      }} 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-xl"
                      title="Экспорт в CSV"
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(calc.id);
                      }} 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-xl"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(calc.id);
                      }} 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-xl text-destructive hover:text-destructive"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2 border-t bg-secondary/20">
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
