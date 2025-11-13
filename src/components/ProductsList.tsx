import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Ingredient } from './RecipeForm';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export interface Equivalence {
  from: string; // единица в рецепте
  to: string;   // единица при покупке
  ratio: number; // сколько единиц "from" содержится в одной единице "to"
}

export interface ProductPrice {
  productName: string;     // название продукта при покупке (например: яйца для ингредиента "белок")
  price: number;           // цена
  priceUnit: string;       // единица измерения при покупке
  priceQuantity: number;   // количество единиц в упаковке
  equivalence?: Equivalence; // для несовместимых единиц (например: 1 яйцо = 40г белка)
}

interface ProductsListProps {
  ingredients: Ingredient[];
  prices: Record<string, ProductPrice>;
  onPricesChange: (prices: Record<string, ProductPrice>) => void;
  onNext: () => void;
  onBack: () => void;
}

const UNITS = ['г', 'кг', 'мл', 'л', 'шт', 'ч.л.', 'ст.л.'];

// Функция для проверки, совместимы ли единицы напрямую
function areUnitsDirectlyCompatible(unit1: string, unit2: string): boolean {
  const weightUnits = ['г', 'кг'];
  const volumeUnits = ['мл', 'л'];
  
  return (
    (weightUnits.includes(unit1) && weightUnits.includes(unit2)) ||
    (volumeUnits.includes(unit1) && volumeUnits.includes(unit2)) ||
    unit1 === unit2
  );
}

export function ProductsList({ ingredients, prices, onPricesChange, onNext, onBack }: ProductsListProps) {
  const updatePrice = (name: string, updates: Partial<ProductPrice>) => {
    const ingredientUnit = ingredients.find((i) => i.name === name)?.unit || 'г';
    const currentPrice = prices[name] || {
      productName: name, // по умолчанию название продукта = название ингредиента
      price: 0,
      priceUnit: ingredientUnit,
      priceQuantity: 1,
    };

    onPricesChange({
      ...prices,
      [name]: {
        ...currentPrice,
        ...updates,
      },
    });
  };

  const updateEquivalence = (name: string, ratio: number) => {
    const ingredient = ingredients.find((i) => i.name === name);
    const currentPrice = prices[name];
    
    if (!ingredient || !currentPrice) return;

    updatePrice(name, {
      equivalence: {
        from: ingredient.unit,
        to: currentPrice.priceUnit,
        ratio: ratio,
      },
    });
  };

  const allPricesSet = ingredients.every((ing) => {
    const price = prices[ing.name];
    if (!price || !price.productName || price.price <= 0 || price.priceQuantity <= 0) return false;
    
    // Если единицы несовместимы, требуется эквивалент
    if (!areUnitsDirectlyCompatible(ing.unit, price.priceUnit)) {
      return price.equivalence && price.equivalence.ratio > 0;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <h3>Укажите стоимость ингредиентов</h3>
          <p className="text-muted-foreground text-sm">
            Укажите цену и единицы измерения при покупке
          </p>
        </div>
        <div className="space-y-6">
          {ingredients.map((ingredient) => {
            const price = prices[ingredient.name] || {
              productName: ingredient.name,
              price: 0,
              priceUnit: ingredient.unit,
              priceQuantity: 1,
            };
            
            const needsEquivalence = !areUnitsDirectlyCompatible(
              ingredient.unit,
              price.priceUnit
            );

            return (
              <Card key={ingredient.name} className="p-4 space-y-3 bg-secondary/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-base">{ingredient.name}</Label>
                    <p className="text-sm text-muted-foreground">
                      В рецепте: {ingredient.amount} {ingredient.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`product-${ingredient.name}`}>Название продукта</Label>
                  <Input
                    id={`product-${ingredient.name}`}
                    placeholder="Например: яйца"
                    value={price.productName || ''}
                    onChange={(e) => updatePrice(ingredient.name, { productName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Как называется продукт при покупке
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`price-${ingredient.name}`}>Цена (₽)</Label>
                    <Input
                      id={`price-${ingredient.name}`}
                      type="number"
                      placeholder="200"
                      value={price.price || ''}
                      onChange={(e) => updatePrice(ingredient.name, { price: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`quantity-${ingredient.name}`}>Количество</Label>
                    <Input
                      id={`quantity-${ingredient.name}`}
                      type="number"
                      placeholder="10"
                      value={price.priceQuantity || ''}
                      onChange={(e) => updatePrice(ingredient.name, { priceQuantity: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`unit-${ingredient.name}`}>Единица измерения</Label>
                  <Select
                    value={price.priceUnit}
                    onValueChange={(value) => updatePrice(ingredient.name, { priceUnit: value })}
                  >
                    <SelectTrigger id={`unit-${ingredient.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Цена {price.price || 0} ₽ за {price.priceQuantity || 1} {price.priceUnit}
                  </p>
                </div>

                {needsEquivalence && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`equiv-${ingredient.name}`}>
                        Эквивалент
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Укажите, сколько {ingredient.unit} содержится в 1 {price.priceUnit}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`equiv-${ingredient.name}`}
                        type="number"
                        placeholder="40"
                        value={price.equivalence?.ratio || ''}
                        onChange={(e) => updateEquivalence(ingredient.name, Number(e.target.value))}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {ingredient.unit} в 1 {price.priceUnit}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Например: 1 яйцо (шт) = 40 г белка
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Назад
        </Button>
        <Button onClick={onNext} disabled={!allPricesSet} className="flex-1">
          Далее
        </Button>
      </div>
    </div>
  );
}
