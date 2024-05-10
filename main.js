let datos ='[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]'

//REFERENCIAS
const boton = document.getElementById("btnSubmit");
const btnAgregar = document.getElementById("btnAgregar");
const btnSubmit = document.getElementById("btnSubmit");
const btnReset =  document.getElementById("btnReset");
const btnModificar = document.getElementById("btnModificar");
const btnEliminar = document.getElementById("btnEliminar");
const filas = document.getElementsByTagName("tr");
const formDatos = document.getElementById("contDatos");
const formAbm= document.getElementById("formABM");
const tbody = document.getElementById("tbody");
const filtroSelect = document.getElementById("filtro");
const bntCalcularPromedio = document.getElementById("calcularPromedio");
let tabla = document.getElementById("tabla");
const botonesOrden = document.querySelectorAll('.btn-order');
const btnOrdenar = document.getElementsByTagName("btn-order");
const checkboxs = document.querySelectorAll("input[type='checkbox']");
const tipoSelect = document.getElementById("tipo");
const divCiudadano = document.getElementById("contenedor-Ciudadano");
const divExtranjero = document.getElementById("contenedor-Extranjero");
let ordenAscendente = true;

//CLASES
class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }
    
    toString() {
        return "ID:" + this.id + "-Nombre:" + this.nombre + "-Apellido:" + this.apellido + "-Fecha de Nacimiento: " + this.fechaNacimiento;
    }
}
class Ciudadano extends Persona{
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }
    toString() {
        return super.toString() + "DNI: " + this.dni;
    }
}   
class Extranjero extends Persona{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
    super(id, nombre, apellido, fechaNacimiento)
    this.paisOrigen = paisOrigen;
    }
    toString() {
        return super.toString() + "-Pais de origen: " + this.paisOrigen;
    }
}

//PERSONAS
let arrayJson= JSON.parse(datos);
let arrayPersonas = [];

//CARGAR ARRAY PERSONAS
arrayJson.forEach(objeto => {
    if (objeto.hasOwnProperty("dni")) {
        arrayPersonas.push(new Ciudadano(objeto.id, objeto.nombre, objeto.apellido, objeto.fechaNacimiento, objeto.dni));
    } 
    else if (objeto.hasOwnProperty("paisOrigen")) {
        arrayPersonas.push(new Extranjero(objeto.id, objeto.nombre, objeto.apellido, objeto.fechaNacimiento, objeto.paisOrigen));
    }
});


//OCULTAR-MOSTRAR PANTALLA INICIO-ABM
function ocultarFormData(){
    formDatos.style.display = "none";
    formABM.style.display = "block"
    btnEliminar.style.display = "none";
    btnModificar.style.display = "none";
    btnSubmit.style.display = "inline-block";
}
function ocultarFormABM(){
    formDatos.style.display = "block";
    formABM.style.display = "none"
    btnEliminar.style.display = "none";
    btnModificar.style.display = "none";
    btnSubmit.style.display = "inline-block";
    tipoSelect.disabled=false;
    filtroSelect.value = "todos";
    labelPromedio.value = 0;
}


//CARGAR PERSONAS A TABLA
function cargarPersonasTabla(personas) {
    let personasFiltradas = [];

    switch (filtroSelect.value) {
        case "ciudadano":
            personasFiltradas = personas.filter(persona => persona instanceof Ciudadano);
            break;
        case "extranjero":
            personasFiltradas = personas.filter(persona => persona instanceof Extranjero);
            break;
        default:
            personasFiltradas = personas;
            break;
    }

    personasFiltradas.forEach(persona => {
        const fila = document.createElement("tr");

        const columnas = ["id", "nombre", "apellido", "fechaNacimiento", "dni", "paisOrigen"];
        columnas.forEach(columna => {
            const celda = document.createElement("td");
            if (persona[columna] !== undefined) {
                celda.textContent = persona[columna];
            } else {
                celda.textContent = "--";
            }
            fila.appendChild(celda);
        });

        tbody.appendChild(fila);
    });
    
}



//FILTRO SELECT
function filtrarPersonasPorTipo(tipo) {
    switch (tipo) {
        case "ciudadanos":
            return arrayPersonas.filter(persona => persona instanceof Ciudadano);
            break
        case "extranjeros":
            return arrayPersonas.filter(persona => persona instanceof Extranjero);
            break
        default:
            return arrayPersonas;
            break
    }
}

function filtrarPorTipo() {
    const personasFiltradas = filtrarPersonasPorTipo(filtroSelect.value);
    tbody.innerHTML = "";
    cargarPersonasTabla(personasFiltradas);
}



//CALCULAR PROMEDIO EDAD

function calcularPromedioEdad(){
    let edades = [];
    let personasFiltradas = filtrarPersonasPorTipo(filtroSelect.value); //me traigo a quienes tengo en la tabla, ya con filtro
    let labelPromedio = document.getElementById("label-promedio");
    /*
    personasFiltradas.forEach(persona => { //agrego las edades que tengo en el array
        edades.push(parseInt(persona.edad));
    });*/
    personasFiltradas.forEach(persona => {
        const fechaNacimiento = persona.fechaNacimiento.toString(); 
        const añoNacimiento = parseInt(fechaNacimiento.slice(0, 4)); // con slice voy cortando los primeros 4 datos de la fecha de nacimiento que saque antes
        const edad = 2024 - añoNacimiento;
        edades.push(edad);
    });

    if (edades.length === 0) { //si me borró a todas las personas
        alert("No se puede calcular el promedio de edad. No hay personas ingresadas");
        labelPromedio.value = 0;
        return;
    }else{
        let sumaEdades = edades.reduce((total, edad) => total + edad, 0); //con reduce voy acumulando los valores y sumandolos en total (desde 0)
        let edadPromedio = sumaEdades / edades.length;
        labelPromedio.value = edadPromedio.toFixed(2);
    }

    
}


//ORDENAR TABLA SORT-
botonesOrden.forEach((boton, index) => {
    boton.addEventListener('click', () => {
        const columna = index; 
        ordenarTabla(columna);
    });
});


function ordenarTabla(columna) {
    const filasArray = Array.from(tbody.querySelectorAll('tr')); // Convertir las filas a un array para manipulación

    // ordeno las filas basadas en el contenido de la columna seleccionada y el estado de ordenamiento
    filasArray.sort((filaA, filaB) => {
        const valorA = filaA.getElementsByTagName('td')[columna].textContent.trim(); 
        const valorB = filaB.getElementsByTagName('td')[columna].textContent.trim();
        
        if(ordenAscendente){
            if (valorA > valorB) { 
                return 1;
            } else if (valorA < valorB) { 
                return -1;
            } else { 
                return 0;
            }
        }else{
            if (valorA < valorB) { 
                return 1;
            } else if (valorA > valorB) { 
                return -1;
            } else { 
                return 0;
            }
        }
        

    });

    limpiarTabla();

    // voy agregando las filas ordenadas a la tabla
    filasArray.forEach(fila => {
        tbody.appendChild(fila);
    });

    ordenAscendente = !ordenAscendente; //cambia el orden 
}

function limpiarTabla(){
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}


//CARGAR PERSONA
function cargarPersona(nombre, apellido, fechaNacimiento, tipo, dni, paisOrigen) {
    
    let ultimoId = obtenerUltimoId();
    if (tipo === "ciudadano") {
        document.getElementById("contenedor-Ciudadano").style.display = "block";
        document.getElementById("contenedor-Extranjero").style.display = "none";
        arrayPersonas.push(new Ciudadano(ultimoId + 1, nombre, apellido, fechaNacimiento, dni));
       
    } else {
        document.getElementById("contenedor-Ciudadano").style.display = "none";
        document.getElementById("contenedor-Extranjero").style.display = "block";
        arrayPersonas.push(new Extranjero(ultimoId + 1, nombre, apellido, fechaNacimiento, paisOrigen));
        
    }
}


// Mostrar Campos Segun Select Vendedor - Cliente
function mostrarCamposSegunSelect(){
    const divCliente = document.getElementById("contenedor-Ciudadano");
    const divVendedor = document.getElementById("contenedor-Extranjero");
    
    if(tipoSelect.value === "ciudadano"){
        divCiudadano.style.display = "block";
        divExtranjero.style.display = "none";
    } else {
        divCiudadano.style.display = "none";
        divExtranjero.style.display = "block";
    }
}

//OBTENER Y RETORNAR ULTIMO ID
function obtenerUltimoId() {
    if (arrayPersonas.length === 0) {
        return 0; 
    } else {
        return parseInt(arrayPersonas[arrayPersonas.length - 1].id);
    }
}


//VALIDAR DATOS INGRESADOS
function validarDatos(nombre, apellido, fechaNacimiento, tipo, dni, paisOrigen) {
    if (nombre.trim() == "" || nombre.length < 3) {
        alert("Ingrese un nombre válido (más a 3 letras)");
        return false;
    }
    if (apellido.trim() == "" || apellido.length < 3) {
        alert("Ingrese un apellido válido (más de 3 letras)");
        return false;
    }
    if (parseInt(fechaNacimiento)<19000101 || parseInt(fechaNacimiento)>20240510) {
        alert("Ingrese una edad válida: aaaammdd ( desde 01 de enero de 1900 hasta el 10 de mayo de 2024");
        return false;
    }

    switch (tipo) {

        case "ciudadano":
            if (isNaN(parseInt(dni)) || parseInt(dni) < 1111111) {
                alert("Ingrese un valor de dni válido (numero mayor a 1111111");
                return false;
            }
            break;
        case "extranjero":
            if (paisOrigen.trim() == "" || paisOrigen.length < 3) {
                alert("Ingrese un pais de origen valido (mas de 3 letras)");
                return false;
            }
         
            break;
        default:
            break;
    }
    return true;
}


//CHECKBOX CAMBIO.
function checkboxChange(){
    checkboxs.forEach(function(checkbox){
        checkbox.addEventListener('change', function() {
        if (this.checked) {
            mostrarColumna(this.value);              
        } else{
            ocultarColumna(this.value);           
        }
        }); 
    });
}

        function ocultarColumna(idColumna){
            let cabecera = tabla.getElementsByTagName('th')[idColumna];
            let celdas;

            for (let i = 0; i < filas.length; i++) {
                celdas = filas[i].getElementsByTagName('td');

                if (celdas[idColumna]) {
                    celdas[idColumna].style.display = 'none';
                }
            }

            if (cabecera) {
                cabecera.style.display = 'none';
            }

        }

        function mostrarColumna(idColumna){
            let cabecera = tabla.getElementsByTagName('th')[idColumna];
            let celdas;

            for (let i = 0; i < filas.length; i++) {
                celdas = filas[i].getElementsByTagName('td');

                if (celdas[idColumna]) 
                {
                    celdas[idColumna].style.display = ''; 
                }
            }
                
            if (cabecera) {
                cabecera.style.display = ''; 
            }
        }




//CARGAR DATOS EN ABM
function cargarDatosAbm(persona)
{
    document.getElementById("id").value = persona.id;
    document.getElementById("nombre").value = persona.nombre;
    document.getElementById("apellido").value = persona.apellido;
    document.getElementById("fechaNacimiento").value = persona.fechaNacimiento;
    

    if(persona.hasOwnProperty("dni"))
    {
            document.getElementById("tipo").value = "ciudadano";
            divExtranjero.style.display = "none";
            divCiudadano.style.display = "block";
            document.getElementById("dni").value = persona.dni;
          
    }else{
            document.getElementById("tipo").value = "extranjero";
            divExtranjero.style.display = "block";
            divCiudadano.style.display = "none";
            document.getElementById("paisOrigen").value = persona.paisOrigen;
    }

}

function limpiarCamposABM()
{
    id.value = "";
    nombre.value = "";
    apellido.value = "";
    fechaNacimiento.value = "";
    dni.value = "";
    paisOrigen.value = "";


}

window.addEventListener("load", function() {
     
    cargarPersonasTabla(arrayPersonas);

     // CLICK EN TABLA
     tabla.addEventListener("dblclick", function(e) {
        const target = e.target;        
        if (target.tagName === "TD") {
            const row = target.parentNode;
            const rowData = Array.from(row.children).map(cell => cell.textContent); //traigo los datos de la row con map y los pongo en un array
            formABM.style.display = "";
            formDatos.style.display = "none";
            btnEliminar.style.display = "inline-block";
            btnModificar.style.display = "inline-block";
            btnSubmit.style.display = "none";
            const personaId = parseInt(rowData[0]);
            const persona = arrayPersonas.find(persona => persona.id === personaId); //busco la persona en el array por su id
            cargarDatosAbm(persona);
            tipoSelect.disabled = true;
            
        }
    });


    //FORMULARIO ABM
    formABM.addEventListener("submit", function (e) {
        e.preventDefault();
        
            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const tipo = document.getElementById("tipo").value;
            const fechaNacimiento = document.getElementById("fechaNacimiento").value;
            const dni = document.getElementById("dni").value;
            const paisOrigen = document.getElementById("paisOrigen").value;

            
            tipoSelect.disabled=false;
            btnEliminar.style.display = "none";
            btnModificar.style.display = "none";
            btnSubmit.style.display = "inline-block";

            if(validarDatos(nombre, apellido, fechaNacimiento, tipo, dni, paisOrigen)) {
                cargarPersona(nombre,apellido, fechaNacimiento, tipo, dni, paisOrigen);
                ocultarFormABM();
                formABM.reset();
                limpiarTabla();
                cargarPersonasTabla(arrayPersonas);
                mostrarCamposSegunSelect();
            }
    
    })
    

    //EVENTO MODIFICAR
    btnModificar.addEventListener('click', (e) =>{   
        e.preventDefault();
        arrayPersonas.forEach(item => {
            if(item.id == parseInt(document.getElementById("id").value)){

                    item.nombre = nombre.value;
                    item.apellido = apellido.value;
                    item.fechaNacimiento = fechaNacimiento.value;

                    if(item instanceof Ciudadano){
                        item.dni = dni.value;
                        
                    }else{

                        item.paisOrigen = paisOrigen.value;
                              
                    }
                
            }});

            formABM.style.display = "none";
            formDatos.style.display = "";
            btnSubmit.style.display = "none";
            tipoSelect.disabled = false;
            limpiarTabla();
            cargarPersonasTabla(arrayPersonas);
            limpiarCamposABM();
    });

    //EVENTO ELIMINAR
        btnEliminar.addEventListener('click', (e) =>{
            e.preventDefault();
            
            const id = parseInt(document.getElementById("id").value);
            const index = arrayPersonas.findIndex(persona => persona.id === id);
            console.log(index);
            if (index !== -1) {
                arrayPersonas.splice(index, 1); // Eliminar la persona del array
                limpiarTabla();
                cargarPersonasTabla(arrayPersonas);
                formABM.style.display = "none";
                formDatos.style.display = "";
                btnSubmit.style.display = "none";
                tipoSelect.disabled = false;
                limpiarCamposABM();
            } else {
                console.log("No se encontró ninguna persona con el ID proporcionado.");
            }
        });


    //BOTONES
    btnReset.addEventListener("click", ocultarFormABM);
    btnCalcularPromedio.addEventListener("click", calcularPromedioEdad);
    btnAgregar.addEventListener("click", ocultarFormData);
    
    //FILTRO
    filtroSelect.addEventListener("change", filtrarPorTipo);
    tipoSelect.addEventListener("change", mostrarCamposSegunSelect); // event listener para el cambio en el select

    checkboxChange();

});
