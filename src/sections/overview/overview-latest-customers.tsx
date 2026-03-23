import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

interface Customer {
  id: string;
  amountSpent: number;
  avatar: string;
  createdAt: number;
  isOnboarded: boolean;
  name: string;
  orders: number;
}

interface OverviewLatestCustomersProps {
  customers?: Customer[];
}

export const OverviewLatestCustomers = (props: OverviewLatestCustomersProps) => {
  const { customers = [] } = props;

  return (
    <Card>
      <CardHeader
        action={(
          <Button
            color="inherit"
            component="a"
            href="#"
          >
            View All
          </Button>
        )}
        title="Latest Customers"
      />
      <Divider />
      <Scrollbar>
        <Table sx={{ minWidth: 500 }}>
          <TableBody>
            {customers.map((customer) => {
              const createdDate = format(customer.createdAt, 'dd MMM');
              const amountSpent = numeral(customer.amountSpent).format('$0,0.00');

              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Stack alignItems="center">
                      <Typography variant="subtitle2">
                        {createdDate}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      noWrap
                      variant="body2"
                    >
                      {customer.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="text.secondary"
                      noWrap
                      variant="body2"
                    >
                      <Typography
                        color="text.primary"
                        component="span"
                        variant="subtitle2"
                      >
                        {customer.orders}
                      </Typography>
                      {' '}
                      orders placed
                    </Typography>
                    <Typography
                      color="text.secondary"
                      noWrap
                      variant="body2"
                    >
                      <Typography
                        color="text.primary"
                        component="span"
                        variant="subtitle2"
                      >
                        {amountSpent}
                      </Typography>
                      {' '}
                      spent
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {customer.isOnboarded && (
                      <Chip
                        color="primary"
                        label="Onboarded"
                        size="small"
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
