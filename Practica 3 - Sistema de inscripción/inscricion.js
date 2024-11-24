const nombreInput = document.getElementById('nombre')
const provinciaInput = document.getElementById('provincia')
const ciudadInput = document.getElementById('Ciudad')
const sectorInput = document.getElementById('sector')
const calleInput = document.getElementById('Calle')
const carreraSelect = document.getElementById('carrera')
const limpiarBtn = document.getElementById('limpiarBtn');
const FinalizarBtn = document.getElementById('FinalizarBTN');
const registroBtn = document.getElementById('registroBtn');
const materiasContainer = document.getElementById('materia-contenedor');
const horariosTable = document.querySelector('#horariosTable tbody');
const siguienteBtn = document.getElementById('siguienteBtn');

const confirmacionNombre = document.getElementById('comNombre');
const confirmacionProvincia = document.getElementById('comProvincia');
const confirmacionCiudad = document.getElementById('comCiudad');
const confirmacionSector = document.getElementById('comSector');
const confirmacionCalle = document.getElementById('comCalle');
const confirmacionCarrera = document.getElementById('comCarrera');

const registroForm = document.getElementById('registro');
const horarioForm = document.getElementById('horarioForm');


const formInscripcion = document.getElementById('formulario-inscripcion');
const formHorario = document.getElementById('seleccion-horario');
const formConfirmacion = document.getElementById('comfirmacion-datos');

//funcion para poder moverme 


const materias = {
    Software: ['Programación', 'Algoritmos', 'Bases de Datos', 'Ingeniería de Software', 'Redes'],
    Multimedia: ['Diseño Gráfico', 'Animación', 'Fotografía', 'Edición de Video', 'Audio Digital'],
    Redes: ['Protocolos de Red', 'Sistemas Operativos', 'Seguridad Informática', 'Ciberseguridad', 'Virtualización']
};

const Horario = ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"];
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];


// Limpiar formulario
limpiarBtn.addEventListener('click', () => {
    document.getElementById('registro').reset();
});


function asignarDiaAleatorio() {
    const diasAsignados = {};
    for (let carrera in materias) {
        diasAsignados[carrera] = materias[carrera].map(() => {
            const diaAleatorio = diasSemana[Math.floor(Math.random() * diasSemana.length)];
            return diaAleatorio;
        });
    }
    return diasAsignados;
}

const diasAsignados = asignarDiaAleatorio();


registroBtn.addEventListener('click', () => {
    const nombre = nombreInput.value;
    const provincia = provinciaInput.value;
    const ciudad = ciudadInput.value;
    const sector = sectorInput.value;
    const calle = calleInput.value;
    const carrera = carreraSelect.value;

    const inputs = [nombreInput, provinciaInput, ciudadInput, sectorInput, calleInput, carreraSelect];
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });

    // Verificar si hay campos vacíos
    let camposVacios = false;

    if (!nombre) {
        nombreInput.classList.add('is-invalid');
        camposVacios = true;
    }
    if (!provincia) {
        provinciaInput.classList.add('is-invalid');
        camposVacios = true;
    }
    if (!ciudad) {
        ciudadInput.classList.add('is-invalid');
        camposVacios = true;
    }
    if (!sector) {
        sectorInput.classList.add('is-invalid');
        camposVacios = true;
    }
    if (!calle) {
        calleInput.classList.add('is-invalid');
        camposVacios = true;
    }
    if (!carrera) {
        carreraSelect.classList.add('is-invalid');
        camposVacios = true;
    }

    // Si hay campos vacíos, mostrar alerta y salir
    if (camposVacios) {
        alert('Por favor, complete todos los campos');
        return;
    }
    alert('Registrado')
    mostrarBloque(formHorario);

    document.getElementById('formulario-inscripcion').classList.add('hidden');
    document.getElementById('seleccion-horario').classList.remove('hidden');

    materiasContainer.innerHTML = '';
    materias[carrera].forEach((materia, index) => {
        const diaAsignado = diasAsignados[carrera][index];
        const div = document.createElement('div');
        div.classList.add('mb-3');
        div.innerHTML = `
        <label id="materia-${index}">${materia} //Día --> ${diaAsignado}</label>
        <div class="dropdown">
            <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown-${index}">
                Seleccionar horario
            </button>
            <ul class="dropdown-menu">
                ${Horario.map((horario, horarioIndex) => `
                    <li>
                        <button class="dropdown-item" type="button" id="horario-${index}-${horarioIndex}">
                            <input type="radio" name="${materia}" value="${horario}" class="form-check-input" style="margin-right: 5px;">
                            ${horario}
                        </button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
        materiasContainer.appendChild(div);
    });


});

siguienteBtn.addEventListener('click', () => {
    const nombre = nombreInput.value;
    const provincia = provinciaInput.value;
    const ciudad = ciudadInput.value;
    const sector = sectorInput.value;
    const calle = calleInput.value;
    const carrera = carreraSelect.value;


    confirmacionNombre.textContent = `${nombre}`;
    confirmacionProvincia.textContent = `${provincia}`;
    confirmacionCiudad.textContent = `${ciudad}`;
    confirmacionSector.textContent = `${sector}`;
    confirmacionCalle.textContent = `${calle}`;
    confirmacionCarrera.textContent = `${carrera}`;

    // Rellenar tabla de horarios seleccionados
    const materiasSeleccionadas = materias[carrera];
    horariosTable.innerHTML = '';
    materiasSeleccionadas.forEach((materia, index) => {
        const horarioSeleccionado = document.querySelector(`input[name="${materia}"]:checked`);
        const horario = horarioSeleccionado ? horarioSeleccionado.value : 'No seleccionado';
        const diaAsignado = diasAsignados[carrera][index];

        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${materia}</td>
            ${diasSemana.map(dia => `
                <td>${dia === diaAsignado ? horario : ''}</td>
            `).join('')}
        `;
        horariosTable.appendChild(row);
    });


    document.getElementById('seleccion-horario').classList.add('hidden');
    document.getElementById('comfirmacion-datos').classList.remove('hidden');
});


function mostrarBloque(bloqueAMostrar) {
    formInscripcion.classList.add('hidden');
    formHorario.classList.add('hidden');
    formConfirmacion.classList.add('hidden');


    bloqueAMostrar.classList.remove('hidden');


    ajustarMenu(bloqueAMostrar);
}

// Función para ajustar el menú según el bloque mostrado
function ajustarMenu(bloqueActual) {
    const menuBloque1 = document.getElementById('menu-bloque-1');
    const menuBloque2 = document.getElementById('menu-bloque-2');
    const menuBloque3 = document.getElementById('menu-bloque-3');

    menuBloque1.style.display = 'block'; // Siempre mostrar bloque 1

    if (bloqueActual === formInscripcion) {
        menuBloque2.style.display = 'none';
        menuBloque3.style.display = 'none';
    } else if (bloqueActual === formHorario) {
        menuBloque2.style.display = 'block';
        menuBloque3.style.display = 'none';
    } else if (bloqueActual === formConfirmacion) {
        menuBloque2.style.display = 'block';
        menuBloque3.style.display = 'block';
    }
}





siguienteBtn.addEventListener('click', () => {



    mostrarBloque(formConfirmacion);
});


document.getElementById('menu-bloque-1').addEventListener('click', () => {
    mostrarBloque(formInscripcion);
});

document.getElementById('menu-bloque-2').addEventListener('click', () => {

    mostrarBloque(formHorario);
});

document.getElementById('menu-bloque-3').addEventListener('click', () => {

    mostrarBloque(formConfirmacion);
});


mostrarBloque(formInscripcion);

FinalizarBtn.addEventListener('click', () => {
    const confirmacion = confirm("¿Estás seguro de finalizar el proceso de inscripción?");

    // Si el usuario acepta, se reinicia todo el proceso
    if (confirmacion) {
        // Reiniciar los formularios
        registroForm.reset();
        horarioForm.reset();

        // Mostrar el primer bloque
        mostrarBloque(formInscripcion);
    }
})
