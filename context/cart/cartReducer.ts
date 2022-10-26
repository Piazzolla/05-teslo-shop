import { CartState } from './';
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from './CartProvider';

type CartActionType =
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - Update Products in Cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change Product Quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove Product In Cart', payload: ICartProduct }
   | { type: '[Cart] - Load Address from Cookies', payload: ShippingAddress }
   | { type: '[Cart] - Update Address', payload: ShippingAddress }
   | {
      type: '[Cart] - Update Cart Summary',
      payload: {
         numberOfItems: number;
         subTotal: number;
         tax: number;
         total: number;
      }
   }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,
            isLoaded: true,
            cart: [...action.payload]
         }
      case '[Cart] - Update Products in Cart':
         return {
            ...state,
            cart: [...action.payload]
         }
      case '[Cart] - Change Product Quantity':
         return {
            ...state,
            cart: state.cart.map(product => {
               if (product._id !== action.payload._id) return product;
               if (product.size !== action.payload.size) return product;

               return action.payload;
            })
         }
      case '[Cart] - Remove Product In Cart':
         return {
            ...state,
            cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
         }
      case '[Cart] - Update Cart Summary':
         return {
            ...state,
            ...action.payload,
         }
      case '[Cart] - Update Address':
      case '[Cart] - Load Address from Cookies':
         return {
            ...state,
            shippingAddress: action.payload,
         }

      default:
         return state;
   }

}