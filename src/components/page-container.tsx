import { Box, Container, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps extends BoxProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: number;
}

export const PageContainer = ({ 
  children, 
  maxWidth = 'xl', 
  padding = 8,
  ...props 
}: PageContainerProps) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        py: padding,
        px: { xs: 2, sm: 3 },
        ...props.sx
      }}
    >
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
};
