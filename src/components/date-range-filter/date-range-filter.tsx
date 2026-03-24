import { Button, ButtonGroup, Popover, Box, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useDateRangeFilter, DateRangeType } from '../../hooks/useDateRangeFilter';

interface DateRangeFilterProps {
  onChange?: (startDate: Date, endDate: Date, label: string) => void;
}

const DateRangeFilter = ({ onChange }: DateRangeFilterProps) => {
  const {
    dateRange,
    setDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    dateLabel,
    anchorEl,
    setAnchorEl,
    open,
    handleDateRangeChange,
    handleCustomDateApply,
    handleClick,
    handleClose,
  } = useDateRangeFilter();

  // Callback when date range changes
  const handleRangeChange = (range: DateRangeType) => {
    handleDateRangeChange(range);
    if (onChange) {
      // Calculate dates again
      const now = new Date();
      let start: Date;
      let end: Date;
      
      switch (range) {
        case 'week':
          start = new Date(now);
          start.setDate(now.getDate() - now.getDay() + 1);
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          break;
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          break;
        default:
          if (customStartDate && customEndDate) {
            start = new Date(customStartDate);
            end = new Date(customEndDate);
          } else {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          }
      }
      
      onChange(start, end, dateLabel);
    }
  };

  const handleApply = () => {
    handleCustomDateApply();
    if (onChange && customStartDate && customEndDate) {
      onChange(new Date(customStartDate), new Date(customEndDate), dateLabel);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <ButtonGroup variant="outlined" size="small">
        <Button 
          variant={dateRange === 'week' ? 'contained' : 'outlined'} 
          onClick={() => handleRangeChange('week')}
        >
          Semaine
        </Button>
        <Button 
          variant={dateRange === 'month' ? 'contained' : 'outlined'} 
          onClick={() => handleRangeChange('month')}
        >
          Mois
        </Button>
        <Button 
          variant={dateRange === 'year' ? 'contained' : 'outlined'} 
          onClick={() => handleRangeChange('year')}
        >
          Année
        </Button>
      </ButtonGroup>
      <Button 
        variant="outlined" 
        startIcon={<CalendarTodayIcon />}
        onClick={handleClick}
      >
        {dateLabel}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" gutterBottom>Date personnalisée</Typography>
          <Stack spacing={2}>
            <TextField
              label="Date de début"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Date de fin"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" onClick={handleApply} fullWidth>
              Appliquer
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Stack>
  );
};

export default DateRangeFilter;
