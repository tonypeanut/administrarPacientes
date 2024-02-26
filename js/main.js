import App from './classes/App.js'
import { crearDB } from './DB.js'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(registrado=>console.log("Se instaló correctamente...", registrado))
        .catch(error=> console.log('Falló la instalación...', error));
} else {
    console.log('Service Workers no soportados');
}

window.onload = () => {
    const app = new App();

    crearDB();
}
