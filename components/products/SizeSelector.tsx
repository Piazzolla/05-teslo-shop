import { Box, Button } from '@mui/material';
import { FC } from 'react';
import { ISize } from '../../interfaces/products';

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];

    // Methods
    onSelectedSize: (size: ISize ) => void
}


export const SizeSelector: FC<Props> = ({ onSelectedSize, selectedSize, sizes}) => (
    <Box>
        {
            sizes.map( size => (
                <Button
                    key={ size }
                    size='small'
                    color={ selectedSize === size? 'primary' : 'info' }
                    onClick={() => onSelectedSize( size )}
                >
                    { size }
                </Button>
            ))
        }
    </Box>
)
