import { FC, useReducer, useEffect } from 'react';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces/cart';
import { OrderSummary } from '../../components/cart/OrderSummary';

export interface CartState {
   isLoaded: boolean;
   cart: ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;
   shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
   isLoaded: false,
   cart: [],
   numberOfItems: 0,
   subTotal: 0,
   tax: 0,
   total: 0,
   shippingAddress: undefined
}

export interface ShippingAddress {
   firstName: string;
   lastName: string;
   address: string;
   address2?: string;
   zip: string;
   city: string;
   country: string
   phone: string;
}


type Props = {
   children?: React.ReactNode
};

export const CartProvider: FC<Props> = ({ children }) => {


   const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)


   useEffect(() => {

      try {


         const cookieCart = Cookie.get('cart');
         if (!cookieCart) { return; }

         const cookieCartParsed: ICartProduct[] = JSON.parse(cookieCart);


         /* 
         Las 3 lineas de codigo anteriores se pueden hacer en una asi: 
         const cookieCart = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')!): []
         si el .get devuelve algo aviso al compilador que tengo un resultado con el ! 
         si no devuelve nada asigno un array vacio a mi variable. 
         */
         if (cookieCartParsed.length === 0) { return; }

         dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: cookieCartParsed })

      } catch (error) {
         dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: [] })
      }
   }, [])


   useEffect(() => {
      const address:ShippingAddress = {
         firstName   : Cookie.get('firstName')  || '',
         lastName    : Cookie.get('lastName')   || '',
         address     : Cookie.get('address')    || '',
         address2    : Cookie.get('address2')   || '',
         zip         : Cookie.get('zip')        || '',
         city        : Cookie.get('city')       || '',
         country     : Cookie.get('country')    || '',
         phone       : Cookie.get('phone')      || '',
     }

     if(!address.firstName) { return; }

     dispatch({ type: '[Cart] - Load Address from Cookies', payload: address})

   }, [])

   useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart));
   }, [state.cart])

   useEffect(() => {

      const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
      const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

      const orderSumary = {
         numberOfItems,
         subTotal,
         tax: subTotal * taxRate,
         total: subTotal * (taxRate + 1)
      }

      dispatch({ type: '[Cart] - Update Cart Summary', payload: orderSumary })
   }, [state.cart])


   const addProductToCart = (product: ICartProduct) => {
      // asi no
      // dispatch({ type: '[Cart] - Add Product', payload: product})

      // asi tampoco
      // const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size )
      // ... mandar al reducer todo el state nuevo y que el reducer lo actualice

      //asi si
      const isProductInCart = state.cart.some(p => p._id === product._id);
      if (!isProductInCart) return dispatch({ type: '[Cart] - Update Products in Cart', payload: [...state.cart, product] })

      const isProductInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
      if (!isProductInCartButDifferentSize) return dispatch({ type: '[Cart] - Update Products in Cart', payload: [...state.cart, product] })


      // Si llegamos aca, es porque existe el producto y en la misma talla. Acumular.
      const updatedProducts = state.cart.map(p => {
         if (p._id !== product._id) return p;
         if (p.size !== product.size) return p;

         // Actualizar cantidad
         p.quantity += product.quantity;
         return p;
      })

      dispatch({ type: '[Cart] - Update Products in Cart', payload: updatedProducts })

   }

   const updateCartQuantity = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Change Product Quantity', payload: product })
   }

   const removeCartProduct = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Remove Product In Cart', payload: product })
   }

   const updateAddress = ( address: ShippingAddress ) => {
      Cookie.set('firstName', address.firstName);
      Cookie.set('lastName', address.lastName);
      Cookie.set('address', address.address);
      Cookie.set('address2', address.address2 || '');
      Cookie.set('zip', address.zip);
      Cookie.set('city', address.city);
      Cookie.set('country', address.country);
      Cookie.set('phone', address.phone);
      dispatch({ type: '[Cart] - Update Address', payload: address })
   }


   return (
      <CartContext.Provider value={{
         ...state,

         //methods
         addProductToCart,
         removeCartProduct,
         updateAddress,
         updateCartQuantity,

      }}>
         {children}
      </CartContext.Provider>
   )
}