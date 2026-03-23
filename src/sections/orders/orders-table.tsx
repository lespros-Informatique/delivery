import { useMemo } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

interface Customer {
  name: string;
}

export interface Order {
  id: string;
  createdAt: number;
  currency: string;
  customer: Customer;
  status: string;
  totalAmount: number;
  updatedAt: number;
}

export interface StatusMap {
  color: string;
  label: string;
}

export const statusMap: Record<string, StatusMap> = {
  complete: {
    color: 'success.main',
    label: 'Complete'
  },
  created: {
    color: 'neutral.500',
    label: 'Created'
  },
  delivered: {
    color: 'warning.main',
    label: 'Delivered'
  },
  placed: {
    color: 'info.main',
    label: 'Placed'
  },
  processed: {
    color: 'error.main',
    label: 'Processed'
  }
};

interface OrdersTableProps {
  count?: number;
  items?: Order[];
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  page?: number;
  rowsPerPage?: number;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const OrdersTable = (props: OrdersTableProps) => {
  const {
    count = 0,
    items = [],
    onPageChange,
    page = 0,
    rowsPerPage = 0,
    onRowsPerPageChange
  } = props;

  // Memoizer les données pour éviter les re-rendus inutiles
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Order
              </TableCell>
              <TableCell>
                Date
              </TableCell>
              <TableCell>
                Customer
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Total
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {memoizedItems.map((order) => {
              const status = statusMap[order.status];
              const createdDate = format(order.createdAt, 'dd MMM yyyy');
              const createdTime = format(order.createdAt, 'HH:mm');
              const totalAmount = numeral(order.totalAmount).format(`${order.currency}0,0.00`);

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      color="inherit"
                      href="#"
                      underline="none"
                      variant="subtitle2"
                    >
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="inherit"
                      variant="inherit"
                    >
                      {createdDate}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="inherit"
                    >
                      {createdTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.customer.name}
                  </TableCell>
                  <TableCell>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          backgroundColor: status.color,
                          borderRadius: '50%',
                          height: 8,
                          width: 8
                        }}
                      />
                      <Typography variant="body2">
                        {status.label}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {totalAmount}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <SvgIcon fontSize="small">
                        <MoreVertIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
};
