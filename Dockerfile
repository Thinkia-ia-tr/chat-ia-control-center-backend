# Imagen base con Node.js
FROM node:18-alpine

# Establece directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala el servidor estático 'serve'
RUN npm install -g serve

# Expone el puerto por defecto de 'serve'
EXPOSE 3000

# Comando para servir la carpeta actual (donde está index.html)
CMD ["serve", ".", "-l", "3000"]
