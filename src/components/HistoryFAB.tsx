import { Button } from './ui/button';
import { History } from 'lucide-react';

interface HistoryFABProps {
  count: number;
  onClick: () => void;
}

export function HistoryFAB({ count, onClick }: HistoryFABProps) {
  if (count === 0) return null;

  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
    >
      <History className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </Button>
  );
}
