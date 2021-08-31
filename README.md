# Mi Mesa

Aplicación para la creación y administración mesas de diálogs.

## Customización de idioma de FirebaseUI

Para poder presentar un el formulario de registro que ofrece FirebaseUI en el idioma español, es necesario clonar el proyecto de FirebaseUI y hacer build del proyecto con el siguiente comando desde ```/src/lib/firebaseui-web```:

    git pull origin master // Actualiza el repositorio
    cd firebase-web // Cambia al directorio de FirebaseUI
    npm install // Instala dependencias
    npm run build build-esm-es-419 // Genera el proyecto en español latinoamericano

La versión de FirebaseUI en español latinoamericano se encuentra en ```/src/lib/firebaseui-web/dist/esm__es_419.js``` y debes copiarlo y pegarlo en la carpeta ```/node_modules/firebaseui/dist/``` y asegurarte que se importe como ```import * as firebaseui from 'firebaseui/dist/esm__es_419'``` donde desees utilizarlo.