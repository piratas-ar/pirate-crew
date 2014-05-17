# Afiliador Pirata

Herramienta para recolectar adhesiones y afiliaciones. El proceso de consenso está documentado acá: https://wiki.partidopirata.com.ar/Afiliador

## Requisitos

* NodeJS, versión estable (está en los repos de las distros de linux)

* GPG instalado y disponible en la variable de entorno PATH.

## Instalación

```
  $ git clone https://github.com/piratas-ar/pirate-crew
  $ npm install
  $ ./start.sh
```

## Esquema de seguridad

1. Los datos de cada miembro afiliado se guardan en un archivo encriptado con una llave pública generada para este fin y que se obtiene directamente de servidores de llaves.

2. La llave privada está partida en tres partes y cada parte la tiene un pirata aleatorio. Se va a utilizar solamente cuando haya que llenar las fichas en papel que hay que presentar en la justicia electoral, y esto requerirá la presencia física de los tres piratas. Vamos a organizar un evento público para generar y dividir la llave privada y distribuir la llave pública.

3. Los miembros pueden desafiliarse con su DNI y una contraseña, que se utilizan como nombre de archivo en forma de hash SHA1 (como no queremos relacionar email con datos, no tenemos forma de borrar la afiliación de forma automática si el pirata afiliado olvida su contraseña).

4. La encriptación de los datos y la generación del hash DNI/contraseña se hacen en el cliente para evitar que los datos personales lleguen al  servidor. El servidor recibe los datos personales encriptados y los de la cuenta de usuario **en dos momentos distintos, de modo que no podemos relacionar a un usuario con sus datos personales**. Los datos de la cuenta se usarán para notificar al partido de la existencia del nuevo afiliado y darlo de alta en los servicios, luego se descartarán.

5. Cuando un miembro se desafilia, los datos encriptados se borran de nuestros servidores, pero la cuenta sigue activa para que pueda seguir participando de nuestras actividades.

6. Los archivos de datos estarán distribuídos en varios servidores.

Este esquema de seguridad permite que nadie con acceso físico o remoto a nuestros servidores pueda leer la información de los miembros, por más que lograra descargarse los archivos de datos.

## TODO

Cosas para hacer:

* Enviarle por email al nuevo afiliado el código de afiliación para que no se pierda.

* Enviar por email el contacto de la persona para darle la bienvenida y hacer el alta en la infraestructura del partido.

* Automatizar la desencriptación de datos con la clave privada (conviene que sea una herramienta a parte).

* Definir el proceso para desafiliar gente que perdió el código de afiliación o contraseña.

* Definir el proceso para volcar los datos a las fichas.

