import { Tune, List, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import {
  Button,
  Stack,
  SvgIcon,
  ToggleButton,
  toggleButtonClasses,
  ToggleButtonGroup
} from '@mui/material';
import { QueryField } from 'src/components/query-field';

interface OrdersSearchProps {
  mode?: 'table' | 'dnd';
  onModeChange?: (value: string) => void;
  onQueryChange?: (value: string) => void;
  query?: string;
}

export const OrdersSearch = (props: OrdersSearchProps) => {
  const { mode = 'table', onModeChange, onQueryChange, query } = props;

  return (
    <Stack
      alignItems="center"
      direction="row"
      flexWrap="wrap"
      gap={3}
      sx={{ p: 3 }}
    >
      <QueryField
        placeholder="Search..."
        onChange={onQueryChange}
        sx={{
          flexGrow: 1,
          order: {
            xs: 1,
            sm: 2
          }
        }}
        value={query}
      />
      <ToggleButtonGroup
        exclusive
        onChange={(event, value) => {
          if (value) {
            onModeChange?.(value);
          }
        }}
        size="small"
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          p: 0.5,
          order: 2,
          [`& .${toggleButtonClasses.root}`]: {
            border: 0,
            '&:not(:first-of-type)': {
              borderRadius: 1
            },
            '&:first-of-type': {
              borderRadius: 1,
              mr: 0.5
            }
          }
        }}
        value={mode}
      >
        <ToggleButton value="table">
          <SvgIcon fontSize="small">
            <List />
          </SvgIcon>
        </ToggleButton>
        <ToggleButton value="dnd">
          <SvgIcon fontSize="small">
            <LayoutGrid />
          </SvgIcon>
        </ToggleButton>
      </ToggleButtonGroup>
      <Button
        size="large"
        startIcon={(
          <SvgIcon fontSize="small">
            <SlidersHorizontal />
          </SvgIcon>
        )}
        sx={{ order: 3 }}
      >
        Filter
      </Button>
    </Stack>
  );
};
