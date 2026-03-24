import { useState, useMemo } from 'react';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, format,
  isWithinInterval, parseISO, isValid
} from 'date-fns';
import { fr } from 'date-fns/locale';

export type DateRangeType = 'week' | 'month' | 'year' | 'custom';

export interface DateRangeFilterResult {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  startDate: Date;
  endDate: Date;
  dateLabel: string;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  open: boolean;
  handleDateRangeChange: (range: DateRangeType) => void;
  handleCustomDateApply: () => void;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
}

export const useDateRangeFilter = (defaultRange: DateRangeType = 'month'): DateRangeFilterResult => {
  const [dateRange, setDateRange] = useState<DateRangeType>(defaultRange);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { startDate, endDate, dateLabel } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;
    let label: string;

    switch (dateRange) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        label = `Semaine du ${format(start, 'dd MMM', { locale: fr })}`;
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMMM yyyy', { locale: fr });
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        label = format(now, 'yyyy', { locale: fr });
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          start = parseISO(customStartDate);
          end = parseISO(customEndDate);
          if (!isValid(start)) start = startOfMonth(now);
          if (!isValid(end)) end = endOfMonth(now);
          label = `${format(start, 'dd MMM yyyy', { locale: fr })} - ${format(end, 'dd MMM yyyy', { locale: fr })}`;
        } else {
          start = startOfMonth(now);
          end = endOfMonth(now);
          label = format(now, 'MMMM yyyy', { locale: fr });
        }
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMMM yyyy', { locale: fr });
    }

    return { startDate: start, endDate: end, dateLabel: label };
  }, [dateRange, customStartDate, customEndDate]);

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
    setAnchorEl(null);
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
    }
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return {
    dateRange,
    setDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    startDate,
    endDate,
    dateLabel,
    anchorEl,
    setAnchorEl,
    open,
    handleDateRangeChange,
    handleCustomDateApply,
    handleClick,
    handleClose,
  };
};

// Utilitaire pour filtrer les données par date
export const filterDataByDateRange = <T extends { [key: string]: any }>(
  data: T[],
  startDate: Date,
  endDate: Date,
  dateField: keyof T
): T[] => {
  return data.filter(item => {
    const dateValue = item[dateField];
    if (!dateValue) return false;
    
    const dateStr = typeof dateValue === 'string' ? dateValue.split(' ')[0] : String(dateValue);
    const date = parseISO(dateStr);
    return isValid(date) && isWithinInterval(date, { start: startDate, end: endDate });
  });
};
