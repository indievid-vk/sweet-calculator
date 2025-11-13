import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Recipe } from './RecipeForm';
import { ProductPrice } from './ProductsList';
import { Labor } from './LaborCosts';
import { OutputData } from './Output';
import { Calculator, Save } from 'lucide-react';

export interface CalculationResult {
  id: string;
  date: string;
  recipe: Recipe;
  prices: Record<string, ProductPrice>; // сохраняем цены для редактирования
  labor: Labor; // сохраняем данные о труде
  output: OutputData; // сохраняем данные о выходе
  ingredientsCost: number;
  laborCost: number;
  totalCost: number;
  markup: number;
  sellingPrice: number;
  pricePerPortion: number;
}

interface CalculationProps {
  recipe: Recipe;
  prices: Record<string, ProductPrice>;
  labor: Labor;
  output: OutputData;
  editingId?: string; // ID редактируемого расчета
  onSave: (calculation: CalculationResult) => void;
  onBack: () => void;
  onReset: () => void;
}

// Функция конвертации между совместимыми единицами
function convertUnits(amount: number, fromUnit: string, toUnit: string): number {
  // Если единицы одинаковые
  if (fromUnit === toUnit) return amount;

  // Конвертация веса
  const weightConversions: Record<string, number> = {
    'г': 1,
    'кг': 1000,
  };

  // Конвертация объема
  const volumeConversions: Record<string, number> = {
    'мл': 1,
    'л': 1000,
  };

  // Попытка конвертации веса
  if (weightConversions[fromUnit] && weightConversions[toUnit]) {
    return (amount * weightConversions[fromUnit]) / weightConversions[toUnit];
  }

  // Попытка конвертации объема
  if (volumeConversions[fromUnit] && volumeConversions[toUnit]) {
    return (amount * volumeConversions[fromUnit]) / volumeConversions[toUnit];
  }

  // Если единицы несовместимы
  return amount;
}

// Функция расчета стоимости одного ингредиента
function calculateIngredientCost(
  ingredientAmount: number,
  ingredientUnit: string,
  price: ProductPrice
): number {
  const { price: totalPrice, priceUnit, priceQuantity, equivalence } = price;

  // Цена за одну единицу товара
  const pricePerUnit = totalPrice / priceQuantity;

  // Если есть эквивалент (несовместимые единицы)
  if (equivalence && equivalence.ratio > 0) {
    // Сколько единиц товара нужно для получения нужного количества ингредиента
    const unitsNeeded = ingredientAmount / equivalence.ratio;
    return unitsNeeded * pricePerUnit;
  }

  // Если единицы совместимы, конвертируем
  const convertedAmount = convertUnits(ingredientAmount, ingredientUnit, priceUnit);
  return convertedAmount * pricePerUnit;
}

export function Calculation({ recipe, prices, labor, output, editingId, onSave, onBack, onReset }: CalculationProps) {
  const [markup, setMarkup] = useState(100);

  // Расчёт стоимости ингредиентов
  const ingredientsCost = recipe.ingredients.reduce((sum, ing) => {
    const price = prices[ing.name];
    if (!price) return sum;

    const cost = calculateIngredientCost(ing.amount, ing.unit, price);
    return sum + cost;
  }, 0);

  // Расчёт стоимости труда
  const laborCost = labor.hours * labor.rate * labor.workers;

  // Общая себестоимость
  const totalCost = ingredientsCost + laborCost;

  // Цена продажи с наценкой
  const sellingPrice = totalCost * (1 + markup / 100);

  // Цена за одну порцию
  const pricePerPortion = sellingPrice / output.portions;

  const handleSave = () => {
    const calculation: CalculationResult = {
      id: editingId || Date.now().toString(), // используем существующий ID при редактировании
      date: editingId ? new Date().toISOString() : new Date().toISOString(), // обновляем дату
      recipe,
      prices, // сохраняем цены
      labor,  // сохраняем труд
      output, // сохраняем выход
      ingredientsCost,
      laborCost,
      totalCost,
      markup,
      sellingPrice,
      pricePerPortion,
    };
    onSave(calculation);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Calculator className="w-5 h-5 text-primary" />
          <h3>Расчёт себестоимости</h3>
        </div>

        {/* Детализация по ингредиентам */}
        <div className="space-y-2">
          <h4 className="text-sm text-muted-foreground">Ингредиенты:</h4>
          {recipe.ingredients.map((ing) => {
            const price = prices[ing.name];
            if (!price) return null;
            
            const cost = calculateIngredientCost(ing.amount, ing.unit, price);
            
            return (
              <div key={ing.name} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">
                  {ing.name} ({ing.amount} {ing.unit})
                </span>
                <span>{cost.toFixed(2)} ₽</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Итого ингредиенты:</span>
            <span>{ingredientsCost.toFixed(2)} ₽</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Труд:</span>
            <span>{laborCost.toFixed(2)} ₽</span>
          </div>

          <div className="flex justify-between py-2 border-t">
            <span>Себестоимость:</span>
            <span>{totalCost.toFixed(2)} ₽</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3>Наценка и цена продажи</h3>

        <div className="space-y-2">
          <Label htmlFor="markup">Наценка (%)</Label>
          <Input
            id="markup"
            type="number"
            value={markup}
            onChange={(e) => setMarkup(Number(e.target.value))}
          />
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Цена продажи:</span>
            <span>{sellingPrice.toFixed(2)} ₽</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Порций: {output.portions}</span>
            <span></span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Цена за порцию:</span>
            <span>{pricePerPortion.toFixed(2)} ₽</span>
          </div>

          <div className="flex justify-between text-primary pt-2 border-t">
            <span>Прибыль:</span>
            <span>+{(sellingPrice - totalCost).toFixed(2)} ₽</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Назад
        </Button>
        <Button onClick={handleSave} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {editingId ? 'Обновить' : 'Сохранить'}
        </Button>
      </div>

      {!editingId && (
        <Button onClick={onReset} variant="ghost" className="w-full">
          Создать новый расчёт
        </Button>
      )}
    </div>
  );
}
