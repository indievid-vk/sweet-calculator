import { useState, useEffect } from 'react';
import { RecipeForm, Recipe } from './components/RecipeForm';
import { ProductsList, ProductPrice } from './components/ProductsList';
import { LaborCosts, Labor } from './components/LaborCosts';
import { Output, OutputData } from './components/Output';
import { Calculation, CalculationResult } from './components/Calculation';
import { HomePage } from './components/HomePage';
import { MyCalculationsPage } from './components/MyCalculationsPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { UsageGuideDialog } from './components/UsageGuideDialog';
import { Button } from './components/ui/button';
import { ChevronLeft, Home, List, HelpCircle } from 'lucide-react';

type Step = 'home' | 'myCalculations' | 'recipe' | 'products' | 'labor' | 'output' | 'calculation';

export default function App() {
  const [step, setStep] = useState<Step>('home');
  const [editingId, setEditingId] = useState<string | null>(null); // ID редактируемого расчета
  const [showGuide, setShowGuide] = useState(false); // Показать справку
  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    category: '',
    ingredients: [],
    comment: '',
  });
  const [prices, setPrices] = useState<Record<string, ProductPrice>>({});
  const [labor, setLabor] = useState<Labor>({
    hours: 0,
    rate: 0,
    workers: 1,
  });
  const [output, setOutput] = useState<OutputData>({
    totalOutput: 0,
    outputUnit: 'кг',
    portions: 0,
  });
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedCalculations = localStorage.getItem('calculations');
    if (savedCalculations) {
      setCalculations(JSON.parse(savedCalculations));
    }

    const savedPrices = localStorage.getItem('prices');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  }, []);

  // Сохранение расчётов в localStorage
  useEffect(() => {
    localStorage.setItem('calculations', JSON.stringify(calculations));
  }, [calculations]);

  // Сохранение цен в localStorage
  useEffect(() => {
    localStorage.setItem('prices', JSON.stringify(prices));
  }, [prices]);

  const handleSaveCalculation = (calculation: CalculationResult) => {
    if (editingId) {
      // Обновляем существующий расчет
      setCalculations(calculations.map((c) => (c.id === editingId ? calculation : c)));
    } else {
      // Добавляем новый расчет
      setCalculations([...calculations, calculation]);
    }
    setEditingId(null);
    setStep('myCalculations');
    resetForm();
  };

  const handleDeleteCalculation = (id: string) => {
    setCalculations(calculations.filter((c) => c.id !== id));
  };

  const handleEditCalculation = (id: string) => {
    const calc = calculations.find((c) => c.id === id);
    if (!calc) return;

    // Загружаем данные расчета для редактирования
    setEditingId(id);
    setRecipe(calc.recipe);
    setPrices(calc.prices);
    setLabor(calc.labor);
    setOutput(calc.output);
    setStep('recipe'); // начинаем с первого шага
  };

  const resetForm = () => {
    setEditingId(null);
    setRecipe({
      name: '',
      category: '',
      ingredients: [],
      comment: '',
    });
    setLabor({
      hours: 0,
      rate: 0,
      workers: 1,
    });
    setOutput({
      totalOutput: 0,
      outputUnit: 'кг',
      portions: 0,
    });
    // Не сбрасываем цены - они могут пригодиться для следующего расчета
  };

  const startNewCalculation = () => {
    resetForm();
    setStep('recipe');
  };

  const goToHome = () => {
    resetForm();
    setStep('home');
  };

  const goToMyCalculations = () => {
    resetForm();
    setStep('myCalculations');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Хедер */}
        <div className="py-6 mb-6">
          {step === 'home' ? (
            <div className="text-center space-y-2">
              <h1 className="text-primary text-4xl font-['Lobster']">Сладкий расчёт</h1>
              <p className="text-muted-foreground text-sm">
                Калькулятор расчета себестоимости кондитерских изделий
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={
                      step === 'myCalculations'
                        ? goToHome
                        : step === 'recipe'
                        ? editingId
                          ? goToMyCalculations
                          : goToHome
                        : () => setStep(getPreviousStep(step))
                    }
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h1 className="text-primary font-['Lobster']">Сладкий расчёт</h1>
                    <p className="text-muted-foreground text-sm">
                      {editingId ? 'Редактирование • ' : ''}{getStepTitle(step)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    onClick={() => setShowGuide(true)} 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl" 
                    title="Справка"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                  {step !== 'myCalculations' && (
                    <Button 
                      onClick={goToMyCalculations} 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl" 
                      title="Мои расчёты"
                    >
                      <List className="w-5 h-5" />
                    </Button>
                  )}
                  <Button onClick={goToHome} variant="ghost" size="icon" className="rounded-xl" title="На главную">
                    <Home className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Прогресс-бар (только для шагов расчета) */}
              {step !== 'myCalculations' && (
                <div className="mt-4 flex gap-1.5">
                  {['recipe', 'products', 'labor', 'output', 'calculation'].map((s, index) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        getStepIndex(step) >= index ? 'bg-primary shadow-sm' : 'bg-primary/15'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Контент */}
        <div className="flex-1 pb-6">
          {step === 'home' && (
            <HomePage
              calculationsCount={calculations.length}
              onNewCalculation={startNewCalculation}
              onViewCalculations={goToMyCalculations}
            />
          )}

          {step === 'myCalculations' && (
            <MyCalculationsPage
              calculations={calculations}
              onDelete={handleDeleteCalculation}
              onEdit={handleEditCalculation}
              onNewCalculation={startNewCalculation}
            />
          )}

          {step === 'recipe' && (
            <RecipeForm recipe={recipe} onChange={setRecipe} onNext={() => setStep('products')} />
          )}

          {step === 'products' && (
            <ProductsList
              ingredients={recipe.ingredients}
              prices={prices}
              onPricesChange={setPrices}
              onNext={() => setStep('labor')}
              onBack={() => setStep('recipe')}
            />
          )}

          {step === 'labor' && (
            <LaborCosts
              labor={labor}
              onChange={setLabor}
              onNext={() => setStep('output')}
              onBack={() => setStep('products')}
            />
          )}

          {step === 'output' && (
            <Output
              output={output}
              onChange={setOutput}
              onNext={() => setStep('calculation')}
              onBack={() => setStep('labor')}
            />
          )}

          {step === 'calculation' && (
            <Calculation
              recipe={recipe}
              prices={prices}
              labor={labor}
              output={output}
              editingId={editingId || undefined}
              onSave={handleSaveCalculation}
              onBack={() => setStep('output')}
              onReset={startNewCalculation}
            />
          )}
        </div>

        {/* Диалог справки */}
        <UsageGuideDialog open={showGuide} onOpenChange={setShowGuide} />
      </div>
    </div>
  );
}

function getStepTitle(step: Step): string {
  const titles: Record<Step, string> = {
    home: 'Главная',
    myCalculations: 'Мои расчёты',
    recipe: 'Шаг 1 из 5',
    products: 'Шаг 2 из 5',
    labor: 'Шаг 3 из 5',
    output: 'Шаг 4 из 5',
    calculation: 'Шаг 5 из 5',
  };
  return titles[step];
}

function getStepIndex(step: Step): number {
  const steps: Step[] = ['recipe', 'products', 'labor', 'output', 'calculation'];
  return steps.indexOf(step);
}

function getPreviousStep(step: Step): Step {
  const steps: Step[] = ['recipe', 'products', 'labor', 'output', 'calculation'];
  const index = steps.indexOf(step);
  return index > 0 ? steps[index - 1] : 'home';
}
