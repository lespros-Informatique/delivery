import { ReactNode, useState } from 'react';
import { Box, Card, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ColumnConfig {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: GridRenderCellParams) => ReactNode;
  valueFormatter?: (value: unknown) => string;
}

export interface ActionOption {
  label: string;
  icon: ReactNode;
  action: string;
  color?: 'primary' | 'error' | 'warning' | 'info';
}

interface DataTableProps {
  rows: Record<string, unknown>[];
  columns: ColumnConfig[];
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: Record<string, unknown>) => void;
  onActionClick?: (row: Record<string, unknown>, action: string) => void;
  checkboxSelection?: boolean;
  loading?: boolean;
  height?: number | string;
  noPadding?: boolean;
  statusColumn?: {
    field: string;
    mapping: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'>;
  };
  actions?: ActionOption[];
}

// Couleurs de statut par défaut
const defaultStatusMapping: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  actif: 'success',
  inactif: 'error',
  en_attente: 'warning',
  payee: 'primary',
  livree: 'success',
  annulee: 'error',
  en_preparation: 'info',
  valide: 'success',
  echoue: 'error',
  assignee: 'info',
  en_cours: 'warning',
};

export const DataTable = ({
  rows,
  columns,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  onRowClick,
  onActionClick,
  checkboxSelection = false,
  loading = false,
  height = 500,
  noPadding = false,
  statusColumn,
  actions,
}: DataTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  // Menu d'actions
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: Record<string, unknown>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionSelect = (action: string) => {
    if (selectedRow && onActionClick) {
      onActionClick(selectedRow, action);
    }
    handleMenuClose();
  };

  // Colonnes d'actions
  const actionColumn: GridColDef | null = actions ? {
    field: 'actions',
    headerName: 'ACTIONS',
    width: 100,
    sortable: false,
    filterable: false,
    align: 'center' as const,
    headerAlign: 'center' as const,
    renderCell: (params: GridRenderCellParams) => (
      <IconButton
        size="small"
        onClick={(e) => handleActionClick(e as React.MouseEvent<HTMLElement>, params.row as Record<string, unknown>)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    ),
  } : null;

  // Préparer les colonnes pour le DataGrid
  const gridColumns: GridColDef[] = columns.map((col) => {
    const gridCol: GridColDef = {
      field: col.field,
      headerName: col.headerName,
      width: col.width,
      flex: col.flex,
      minWidth: col.minWidth,
      align: col.align,
      headerAlign: col.headerAlign,
      sortable: col.sortable ?? true,
      filterable: col.filterable ?? true,
    };

    // Ajouter le renderCell personnalisé
    if (col.renderCell) {
      gridCol.renderCell = col.renderCell;
    }

    // Ajouter le valueFormatter
    if (col.valueFormatter) {
      gridCol.valueFormatter = (value: unknown) => col.valueFormatter!(value);
    }

    // Gestion automatique des statuts
    if (statusColumn && col.field === statusColumn.field) {
      gridCol.renderCell = (params: GridRenderCellParams) => {
        const statusValue = params.value as string;
        const mapping = statusColumn.mapping || defaultStatusMapping;
        return (
          <Chip
            label={statusValue}
            color={mapping[statusValue] || 'default'}
            size="small"
          />
        );
      };
      gridCol.align = 'center';
      gridCol.headerAlign = 'center';
    }

    return gridCol;
  });

  // Ajouter le numéro de ligne et les actions
  const columnsWithIndex: GridColDef[] = [
    {
      field: 'numero',
      headerName: 'N°',
      width: 60,
      align: 'center' as const,
      headerAlign: 'center' as const,
      sortable: false,
      filterable: false,
    },
    ...gridColumns,
  ];

  if (actionColumn) {
    columnsWithIndex.push(actionColumn);
  }

  // Préparer les lignes avec numéro séquentiel
  const rowsWithIndex = rows.map((row, index) => ({
    ...row,
    id: row.id || row.id_commande || row.id_user || row.id_client || index,
    numero: index + 1,
  }));

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ height, width: '100%' }}>
        <DataGrid
          rows={rowsWithIndex}
          columns={columnsWithIndex}
          initialState={{
            pagination: {
              paginationModel: { pageSize },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          onRowClick={(params) => onRowClick?.(params.row as Record<string, unknown>)}
          loading={loading}
          getRowId={(row) => row.id}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 1,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.50',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'action.hover',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            ...(noPadding && {
              '& .MuiDataGrid-cell': {
                py: 0.5,
              },
            }),
          }}
        />
      </Box>

      {/* Menu d'actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        {actions?.map((action, index) => (
          <MenuItem key={index} onClick={() => handleActionSelect(action.action)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default DataTable;
