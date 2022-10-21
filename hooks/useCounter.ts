import { useState } from "react"

export const useCounter = ( initialValue = 0, maxValue = 1 ) => {
    
    const [counter, setCounter] = useState( initialValue )

    const increment = ( value = 1 ) => {
        if( counter < maxValue) {
            setCounter( (current) => current + value );
        }
    }

    const decrement = ( value = 1) => {
        if ( counter <= 1) return;
        setCounter((current) => current - value );
    }
    const reset = () => {
        setCounter( initialValue );
    }
 
    return {
        counter,
        increment,
        decrement,
        reset
    } 
}