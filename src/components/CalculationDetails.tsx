import { Card } from './ui/card';
import { CalculationResult } from './Calculation';
import { Separator } from './ui/separator';

interface CalculationDetailsProps {
  calculation: CalculationResult;
}

export function CalculationDetails({ calculation }: CalculationDetailsProps) {
  const { recipe, prices, labor, output, ingredientsCost, laborCost, totalCost, markup, sellingPrice, pricePerPortion } = calculation;

  return (
    <div className="space-y-4">
      {/* Информация о рецепте */}
      <Card className="p-4 space-y-3">
        <h4>Рецепт</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Категория:</span>
            <span>{recipe.category}</span>
          </div>
          {recipe.comment && (
            <div>
              <span className="text-muted-foreground">Комментарий:</span>
              <p className="mt-1">{recipe.comment}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Ингредиенты */}
      <Card className="p-4 space-y-3">
        <h4>Ингредиенты</h4>
        <div className="space-y-2">
          {recipe.ingredients.map((ing, index) => {
            const price = prices[ing.name];
            return (
              <div key={index} className="text-sm">
                <div className="flex justify-between">
                  <span>{ing.name}</span>
                  <span>{ing.amount} {ing.unit}</span>
                </div>
                {price && (
                  <div className="text-muted-foreground text-xs mt-1 pl-4">
                    Продукт: {price.productName} — {price.price}₽ за {price.priceQuantity} {price.priceUnit}
                    {price.equivalence && (
                      <span> (эквивалент: {price.equivalence.ratio} {ing.unit} в 1 {price.priceUnit})</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Стоимость ингредиентов:</span>
          <span>{ingredientsCost.toFixed(2)} ₽</span>
        </div>
      </Card>

      {/* Труд */}
      <Card className="p-4 space-y-3">
        <h4>Затраты на труд</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Часы работы:</span>
            <span>{labor.hours} ч</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ставка:</span>
            <span>{labor.rate} ₽/ч</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Работников:</span>
            <span>{labor.workers}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Стоимость труда:</span>
            <span>{laborCost.toFixed(2)} ₽</span>
          </div>
        </div>
      </Card>

      {/* Выход */}
      <Card className="p-4 space-y-3">
        <h4>Выход продукции</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Общий выход:</span>
            <span>{output.totalOutput} {output.outputUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Количество порций:</span>
            <span>{output.portions}</span>
          </div>
        </div>
      </Card>

      {/* Итоговый расчет */}
      <Card className="p-4 space-y-3 bg-primary/5">
        <h4>Итоговый расчет</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Себестоимость:</span>
            <span>{totalCost.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Наценка:</span>
            <span>{markup}%</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Цена продажи:</span>
            <span>{sellingPrice.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between">
            <span>Цена за порцию:</span>
            <span>{pricePerPortion.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between text-primary">
            <span>Прибыль:</span>
            <span>+{(sellingPrice - totalCost).toFixed(2)} ₽</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
