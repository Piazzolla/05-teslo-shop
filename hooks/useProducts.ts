import useSWR , { SWRConfiguration } from 'swr';
import { IProduct } from '../interfaces';


//const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useProducts = ( url: string, config: SWRConfiguration = {}) => {
    const { data, error } = useSWR<IProduct[] | IProduct>(`/api${ url }`, config); /* useSWR<IProduct> le estoy
    diciendo que la informacion de retorno es de tipo IProduct */

    return {
        products: data || [], //si no hay data toma el valor []
        isLoading: !error && !data,
        isERror: error
    }

}