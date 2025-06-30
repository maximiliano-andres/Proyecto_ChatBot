FROM node:20

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto del código de la aplicación
COPY . .

# Usa el puerto definido por la variable de entorno o 1010 por defecto
ENV PORT=1010
EXPOSE $PORT

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]
