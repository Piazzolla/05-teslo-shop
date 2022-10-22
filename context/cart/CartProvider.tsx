import { FC, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
   cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
   cart: []
}


type Props = {
   children?: React.ReactNode
  };

export const CartProvider:FC<Props> = ({ children }) => {


   const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

   const addProductToCart = ( product:ICartProduct) => {
     // asi no
      // dispatch({ type: '[Cart] - Add Product', payload: product})

      // asi tampoco
      // const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size )
      // ... mandar al reducer todo el state nuevo y que el reducer lo actualice
      
      //asi si
      const isProductInCart = state.cart.some( p => p._id === product._id );
      if( ! isProductInCart ) return dispatch({ type: '[Cart] - Update Products in Cart', payload: [ ...state.cart, product ]})

      const isProductInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size);
      if( !isProductInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update Products in Cart', payload: [ ...state.cart, product ]})


      // Si llegamos aca, es porque existe el producto y en la misma talla. Acumular.
      const updatedProducts = state.cart.map( p => {
         if (p._id !== product._id ) return p;
         if (p.size !== product.size ) return p;

         // Actualizar cantidad
         p.quantity += product.quantity;
         return p;
      })

      dispatch({ type: '[Cart] - Update Products in Cart', payload: updatedProducts})

   }

   return (
       <CartContext.Provider value={{
           ...state,

           //methods
           addProductToCart
       }}>
           { children }
       </CartContext.Provider>
   )
}