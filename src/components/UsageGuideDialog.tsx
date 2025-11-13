import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface UsageGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageGuideDialog({ open, onOpenChange }: UsageGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Примеры работы с единицами измерения</DialogTitle>
          <DialogDescription>
            Узнайте, как правильно указывать эквиваленты для разных единиц измерения
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Пример 1 */}
            <div className="space-y-3">
              <h4 className="text-primary">Пример 1: Яйца</h4>
              <div className="space-y-2">
                <p><strong>Ситуация:</strong></p>
                <p>В рецепте указано "белок 100г", но вы покупаете яйца поштучно.</p>
                
                <p className="pt-2"><strong>Решение:</strong></p>
                <div className="bg-secondary/30 p-3 rounded-lg space-y-1">
                  <p>• <strong>Ингредиент в рецепте:</strong> белок, 100г</p>
                  <p>• <strong>Название продукта:</strong> яйца</p>
                  <p>• <strong>Цена:</strong> 120₽</p>
                  <p>• <strong>Количество:</strong> 10</p>
                  <p>• <strong>Единица при покупке:</strong> шт</p>
                  <p>• <strong>Эквивалент:</strong> 30 (граммов белка в 1 яйце)</p>
                </div>
                
                <p className="pt-2"><strong>Расчёт:</strong></p>
                <div className="bg-accent/20 p-3 rounded-lg space-y-1">
                  <p>1. Сколько яиц нужно: 100г ÷ 30г/шт = 3.33 яйца</p>
                  <p>2. Цена за 1 яйцо: 120₽ ÷ 10шт = 12₽</p>
                  <p>3. Стоимость белка: 3.33 × 12₽ = <strong>40₽</strong></p>
                </div>
              </div>
            </div>

            {/* Пример 2 */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">Пример 2: Сахарная пудра из сахара</h4>
              <div className="space-y-2">
                <p><strong>Ситуация:</strong></p>
                <p>В рецепте "сахарная пудра 200г", вы покупаете обычный сахар и молите его.</p>
                
                <p className="pt-2"><strong>Решение:</strong></p>
                <div className="bg-secondary/30 p-3 rounded-lg space-y-1">
                  <p>• <strong>Ингредиент в рецепте:</strong> сахарная пудра, 200г</p>
                  <p>• <strong>Название продукта:</strong> сахар</p>
                  <p>• <strong>Цена:</strong> 50₽</p>
                  <p>• <strong>Количество:</strong> 1</p>
                  <p>• <strong>Единица при покупке:</strong> кг</p>
                  <p>• <strong>Эквивалент:</strong> не нужен (г и кг - совместимые единицы)</p>
                </div>
                
                <p className="pt-2"><strong>Расчёт (автоматический):</strong></p>
                <div className="bg-accent/20 p-3 rounded-lg space-y-1">
                  <p>1. Конвертация: 200г = 0.2кг</p>
                  <p>2. Стоимость: 0.2кг × 50₽/кг = <strong>10₽</strong></p>
                </div>
              </div>
            </div>

            {/* Пример 3 */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">Пример 3: Сливки в пакетах</h4>
              <div className="space-y-2">
                <p><strong>Ситуация:</strong></p>
                <p>В рецепте "сливки 500мл", продаются в пакетах по 200мл.</p>
                
                <p className="pt-2"><strong>Решение:</strong></p>
                <div className="bg-secondary/30 p-3 rounded-lg space-y-1">
                  <p>• <strong>Ингредиент в рецепте:</strong> сливки, 500мл</p>
                  <p>• <strong>Название продукта:</strong> сливки 33%</p>
                  <p>• <strong>Цена:</strong> 60₽</p>
                  <p>• <strong>Количество:</strong> 200</p>
                  <p>• <strong>Единица при покупке:</strong> мл</p>
                  <p>• <strong>Эквивалент:</strong> не нужен (одинаковые единицы)</p>
                </div>
                
                <p className="pt-2"><strong>Расчёт (автоматический):</strong></p>
                <div className="bg-accent/20 p-3 rounded-lg space-y-1">
                  <p>1. Сколько пакетов: 500мл ÷ 200мл = 2.5 пакета</p>
                  <p>2. Стоимость: 2.5 × 60₽ = <strong>150₽</strong></p>
                </div>
              </div>
            </div>

            {/* Пример 4 */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">Пример 4: Ванилин в пакетиках</h4>
              <div className="space-y-2">
                <p><strong>Ситуация:</strong></p>
                <p>В рецепте "ванилин 2г", продаётся в пакетиках по 1.5г.</p>
                
                <p className="pt-2"><strong>Решение:</strong></p>
                <div className="bg-secondary/30 p-3 rounded-lg space-y-1">
                  <p>• <strong>Ингредиент в рецепте:</strong> ванилин, 2г</p>
                  <p>• <strong>Название продукта:</strong> ванилин</p>
                  <p>• <strong>Цена:</strong> 15₽</p>
                  <p>• <strong>Количество:</strong> 1.5</p>
                  <p>• <strong>Единица при покупке:</strong> г</p>
                  <p>• <strong>Эквивалент:</strong> не нужен (одинаковые единицы)</p>
                </div>
                
                <p className="pt-2"><strong>Расчёт (автоматический):</strong></p>
                <div className="bg-accent/20 p-3 rounded-lg space-y-1">
                  <p>1. Сколько пакетиков: 2г ÷ 1.5г = 1.33 пакетика</p>
                  <p>2. Стоимость: 1.33 × 15₽ = <strong>20₽</strong></p>
                </div>
              </div>
            </div>

            {/* Совместимые единицы */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">Совместимые единицы (эквивалент не нужен)</h4>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <p>• <strong>г ↔ кг</strong> (1кг = 1000г)</p>
                <p>• <strong>мл ↔ л</strong> (1л = 1000мл)</p>
                <p>• <strong>шт ↔ шт</strong> (одинаковые)</p>
                <p>• <strong>ч.л. ↔ ч.л.</strong> (одинаковые)</p>
                <p>• <strong>ст.л. ↔ ст.л.</strong> (одинаковые)</p>
              </div>
            </div>

            {/* Несовместимые единицы */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">Несовместимые единицы (нужен эквивалент)</h4>
              <div className="bg-destructive/10 p-4 rounded-lg space-y-2">
                <p>• <strong>г ↔ шт</strong> (например: мука в граммах, мука в пачках)</p>
                <p>• <strong>мл ↔ шт</strong> (например: молоко в мл, молоко в бутылках)</p>
                <p>• <strong>г ↔ ч.л./ст.л.</strong> (например: соль в граммах, соль в ложках)</p>
                <p>• <strong>мл ↔ ч.л./ст.л.</strong> (например: вода в мл, вода в ложках)</p>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Для несовместимых единиц всегда указывайте эквивалент!
              </p>
            </div>

            {/* Советы */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-primary">💡 Полезные советы</h4>
              <div className="space-y-2">
                <p>1. <strong>Название продукта</strong> - это то, как вы его покупаете (например, для "белка" пишите "яйца")</p>
                <p>2. <strong>Эквивалент</strong> показывается автоматически, только когда единицы несовместимы</p>
                <p>3. Если сомневаетесь в эквиваленте - взвесьте или измерьте продукт дома</p>
                <p>4. Сохраняйте часто используемые цены - они пригодятся для следующих расчётов</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
