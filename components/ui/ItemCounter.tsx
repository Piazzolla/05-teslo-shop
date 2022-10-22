import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { IconButton, Box, Typography } from '@mui/material';
import { Number } from "mongoose";
import { FC } from "react"
import { useCounter } from '../../hooks/useCounter';

interface Props {
  currentValue?: number;
  maxValue?: number;

  // Methods
  updateQuantity: ( quantity:number) => void;

}

export const ItemCounter: FC<Props> = ({ currentValue = 0, maxValue = 0 , updateQuantity }) => {

  const { counter, decrement, increment } = useCounter(currentValue, maxValue);

  const onIncrement = () => {
    increment();
    updateQuantity( counter + 1 );
  }
  
  const onDecrement = () => {
    decrement();
    updateQuantity( counter - 1 );
   }


  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={ onDecrement }
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}> {counter} </Typography>
      <IconButton
        onClick={ onIncrement }

      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
