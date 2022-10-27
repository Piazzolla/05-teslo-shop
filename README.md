# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos
```

docker-compose up -d
```

* El -d, significa __detached__

* MongDB URL Local:
```

mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__


* Recontruir los módulos de node y levantar Next
```

yarn install
yarn dev
```

## Llenar la base de datos con info de pruebas

Llamar a:
```

http://localhost:3000/api/seed
```


### __Anotaciones del curso__

- El pages/api trabaja en backend y obtiene la data desde la bd.   
El /apis trabaja en front y manda requests al back para obtener esa misma data.   
   

- La Entry de models es el formato de la data en mongoose, lo uso en backend.   
La Entry de interfaces es como se ve en el front.

- /pages/entries/index.js fue creado con el snippet nextapi (API Routes). Esto recibe los requests rest al back. Al snippet le falta el nombre de la funcion, por eso da un error, lo agrego y ya.


### Importante!

La dependencia next-auth fue fijada en package.json en 
   "next-auth": "4.2.1",

   sin el ^ para seguir con la compatibilidad respecto del curso. Esto genera una vulnerabilidad y debe ser arreglado. 