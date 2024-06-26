import { eliminarCita, cargarEdicion } from '../funciones.js';
import { contenedorCitas } from '../selectores.js';
import { DB } from '../DB.js'

class UI {
    imprimirAlerta (mensaje, tipo){
        const divMensaje = document.createElement('div');
        
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        // Agregar clase en base al tipo de error
        if(tipo==='error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta después de 5 segundos
        setTimeout( () => {
            divMensaje.remove()
        }, 5000);
    }

    imprimirCitas(){
        this.limpiarHTML();

        // Leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function () {
            fnTextoHeading(total.result);
        }

        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                // Scripting de los elementos de la cita
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title','font-weight-bolder');
                mascotaParrafo.textContent = mascota;
                
                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML=`
                    <span class="font-weight-bolder">Propietario: </span> ${propietario}
                `;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML=`
                    <span class="font-weight-bolder">Teléfono: </span> ${telefono}
                `;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML=`
                    <span class="font-weight-bolder">Fecha: </span> ${fecha}
                `;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML=`
                    <span class="font-weight-bolder">Hora: </span> ${hora}
                `;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML=`
                    <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
                `;

                // Botón para eliminar esta cita
                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                `;
                btnEliminar.onclick = () => eliminarCita(id);

                // Añade un botón para editar
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn','btn-info');
                btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                `
                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);

                // Agregar los parrafos al divCita
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);

                // Agregar las citas al HTML
                contenedorCitas.appendChild(divCita);

                // Ve al sigiuente elemento
                cursor.continue();
            }
        }

    }

    textoHeading(resultado){
        const heading = document.querySelector('#administra');
        if(resultado > 0){
            heading.textContent = 'Administra tus Citas'
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

export default UI;