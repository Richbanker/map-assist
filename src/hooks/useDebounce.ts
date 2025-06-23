import { useState, useEffect } from 'react';

/**
 * Хук для "дебаунсинга" значения.
 * @param value Значение для дебаунсинга (например, поисковый запрос).
 * @param delay Задержка в миллисекундах.
 * @returns Задержанное значение.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер, который обновит значение после задержки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при каждом изменении значения или анмаунте компонента
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Перезапускаем эффект только если значение или задержка изменились

  return debouncedValue;
} 