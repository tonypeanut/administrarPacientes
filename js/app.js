import App from './classes/App.js'
import { crearDB } from './DB.js'

window.onload = () => {
    const app = new App();

    crearDB();
}
