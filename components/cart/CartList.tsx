import { FC } from "react";
import NextLink from "next/link";
import {
  Typography,
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import { initialData } from "../../database/products";
import { ItemCounter } from "../ui";

interface Props {
  editable?: boolean;
}

const productsInCars = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
      {productsInCars.map((product) => (
        <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            {/* TODO: redirect to the page product */}
            <NextLink href="/product/slug" passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.images[0]}`}
                    component="img"
                    sx={{ borderRadius: 5 }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla{" "}
                <Typography variant="subtitle2" component="strong">
                  M
                </Typography>
              </Typography>

              {editable ? (
                <ItemCounter />
              ) : (
                <Typography variant="h5">3 Items</Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button variant="text" color="secondary">
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
