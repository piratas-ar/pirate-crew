# Afiliador Pirata

Herramienta para recolectar adhesiones y afiliaciones.

## Requisitos

* NodeJS, versión estable (está en los repos de las distros de linux)

* GPG instalado y disponible en la variable de entorno PATH.

## Instalación

```
  npm install pirate-crew
```

## Esquema de seguridad

1. Los datos de cada miembro afiliado se guardan en un archivo encriptado con una clave pública generada especialmente para este fin.

2. La clave privada la tienen tres piratas aleatorios, y se va a utilizar solamente cuando haya que llenar las fichas en papel que hay que presentar en la justicia electoral.

3. Los miembros pueden desafiliarse con un código de afiliado autogenerado y una contraseña, que se utilizan como nombre de archivo en forma de hash SHA1.

4. Cuando un miembro se desafilia, los datos encriptados se borran de nuestros servidores.

Este esquema de seguridad permite que nadie con acceso físico o remoto a nuestros servidores pueda leer la información de los miembros, por más que lograra descargarse los archivos de datos.

## TODO

Cosas para hacer:

* Enviarle por email al nuevo afiliado el código de afiliación para que no se pierda.

* Enviar por email el contacto de la persona para darle la bienvenida y hacer el alta en la infraestructura del partido.

* Automatizar la desencriptación de datos con la clave privada (conviene que sea una herramienta a parte).

* Definir el proceso para desafiliar gente que perdió el código de afiliación o contraseña.

* Definir el proceso para volcar los datos a las fichas.

