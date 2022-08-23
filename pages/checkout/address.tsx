import { useContext } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { jwt, countries } from "../../utils";
import { CartContext } from "../../context/cart/CartContext";

type FormData = {
  name: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    name: Cookies.get("name") || "",
    lastName: Cookies.get("lastName") || "",
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    zip: Cookies.get("zip") || "",
    city: Cookies.get("city") || "",
    country: Cookies.get("country") || "",
    phone: Cookies.get("phone") || "",
  };
};

const AddressPage = () => {
  const router = useRouter();

  const { updateAddress } = useContext(CartContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const onSubmit = (data: FormData) => {
    updateAddress(data);

    router.push("/checkout/summary");
  };

  return (
    <ShopLayout
      title="Dirección"
      pageDescription="Confirmar dirección del destino"
    >
      <Typography variant="h1" component="h1">
        Address
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Name"
              variant="filled"
              fullWidth
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Last name"
              variant="filled"
              fullWidth
              {...register("lastName", { required: "lastName is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Address"
              variant="filled"
              fullWidth
              {...register("address", { required: "address is required" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Address 2 (optional)"
              variant="filled"
              fullWidth
              {...register("address2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Zip"
              variant="filled"
              fullWidth
              {...register("zip", { required: "Zip is required" })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="City"
              variant="filled"
              fullWidth
              {...register("city", { required: "City is required" })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="Country"
                defaultValue={Cookies.get("country") || countries[0].code}
                {...register("country", { required: "Country is required" })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {countries.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="tel"
              label="Phone"
              variant="filled"
              fullWidth
              {...register("phone", { required: "phone is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Review order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = "" } = req.cookies;
  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: "/auth/login?p=/checkout/address",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AddressPage;
