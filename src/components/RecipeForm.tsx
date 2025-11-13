import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Minus } from 'lucide-react';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  name: string;
  category: string;
  ingredients: Ingredient[];
  comment: string;
}

interface RecipeFormProps {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
  onNext: () => void;
}

const UNITS = ['г', 'кг', 'мл', 'л', 'шт', 'ч.л.', 'ст.л.'];
const CATEGORIES = ['Торты', 'Пирожные', 'Капкейки', 'Печенье', 'Десерты', 'Другое'];

export function RecipeForm({ recipe, onChange, onNext }: RecipeFormProps) {
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: '',
    amount: 0,
    unit: 'г',
  });

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.amount > 0) {
      onChange({
        ...recipe,
        ingredients: [...recipe.ingredients, { ...newIngredient }],
      });
      setNewIngredient({ name: '', amount: 0, unit: 'г' });
    }
  };

  const removeIngredient = (index: number) => {
    onChange({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const canProceed = recipe.name && recipe.category && recipe.ingredients.length > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipe-name">Название изделия</Label>
          <Input
            id="recipe-name"
            placeholder="Например: Торт Наполеон"
            value={recipe.name}
            onChange={(e) => onChange({ ...recipe, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория</Label>
          <Select value={recipe.category} onValueChange={(value) => onChange({ ...recipe, category: value })}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий (опционально)</Label>
          <Textarea
            id="comment"
            placeholder="Особенности рецепта, заметки..."
            value={recipe.comment}
            onChange={(e) => onChange({ ...recipe, comment: e.target.value })}
            rows={3}
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h3>Ингредиенты</h3>
        
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2">
            <Input
              placeholder="Название"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Кол-во"
              className="w-24"
              value={newIngredient.amount || ''}
              onChange={(e) => setNewIngredient({ ...newIngredient, amount: Number(e.target.value) })}
            />
            <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}>
              <SelectTrigger className="w-20">
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
            <Button onClick={addIngredient} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {recipe.ingredients.length > 0 && (
          <Card className="p-4">
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span>
                    {ingredient.name} — {ingredient.amount} {ingredient.unit}
                  </span>
                  <Button onClick={() => removeIngredient(index)} size="icon" variant="ghost">
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Button onClick={onNext} disabled={!canProceed} className="w-full" size="lg">
        Далее
      </Button>
    </div>
  );
}
