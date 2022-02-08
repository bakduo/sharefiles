import { app } from "../src/main";
import { appconfig } from '../src/config/configure';

const puerto = appconfig.port || 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    console.log('error en el servidor:', error);
});