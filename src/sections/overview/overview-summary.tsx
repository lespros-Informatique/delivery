import { Card, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface OverviewSummaryProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export const OverviewSummary = (props: OverviewSummaryProps) => {
  const { icon, label, value } = props;

  return (
    <Card>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{ p: 2 }}
      >
        {icon}
        <div>
          <Typography
            color="text.secondary"
            variant="overline"
          >
            {label}
          </Typography>
          <Typography variant="h6">
            {value}
          </Typography>
        </div>
      </Stack>
    </Card>
  );
};
