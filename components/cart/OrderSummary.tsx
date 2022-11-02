import { Grid, Typography } from "@mui/material"
import { NextPage } from "next";
import { useContext } from 'react';
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props { 
    order?: {
        numberOfItems: number;
        subTotal: number;
        total: number;
        tax: number;
    }
}

export const OrderSummary: NextPage<Props> = ( {order} ) => {

    const { numberOfItems, subTotal, total, tax} = useContext(CartContext);
    
    if( !order ) {
        order = { numberOfItems, subTotal, total, tax};
    }


    

    return (
        <Grid container>
            <Grid item xs={ 6 }  display='flex' >
                <Typography>
                    No. Productos
                </Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent={'end'}>
                <Typography>
                    { order.numberOfItems } { order.numberOfItems > 1? 'productos': 'producto'}
                </Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex'>
                <Typography>
                    SubTotal
                </Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent={'end'}>
                <Typography>
                    { currency.format(order.subTotal) }
                </Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex'>
                <Typography>
                    Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) *100}%)
                </Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent={'end'}>
                <Typography>
                    { currency.format(order.tax) }
                </Typography>
            </Grid>
            <Grid item xs={ 6 } sx={{ mt:2 }} display='flex' >
                <Typography variant="subtitle1">
                    Total:
                </Typography>
            </Grid>
            <Grid item xs={ 6 } sx={{ mt:2 }}  display='flex' justifyContent={'end'}>
                <Typography variant="subtitle1">
                    { currency.format(order.total) }
                </Typography>
            </Grid>
        </Grid>
  )
}
