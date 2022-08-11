import NextLink from "next/link";
import { Grid, Typography, Chip, Link } from "@mui/material";
import { ShopLayout } from "../../components/layouts";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagado",
    description: "Muestra información si esta pagada la orden o no",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagada" variant="outlined" />
      );
    },
  },
  {
    field: "orderLink",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">Ver orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: true, fullname: "Jhosua Pachón" },
  { id: 2, paid: false, fullname: "Juan David Rojas Roldan" },
  { id: 3, paid: true, fullname: "Miguel Ángel Duran" },
  { id: 4, paid: false, fullname: "Nicolas Londoño" },
  { id: 5, paid: false, fullname: "Juan David Posso Rengifo" },
  { id: 6, paid: true, fullname: "Kevin Steve Victoria" },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial ordenes del cliente"
      pageDescription="Historial ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPage;
