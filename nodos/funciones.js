window.addEventListener("load", cargar);
window.addEventListener("load", cargarPersonas);
var xml = new XMLHttpRequest();

function cargar(){
	document.getElementById("btnGuardar").addEventListener("click", guardar);
	document.getElementById("btnCerrar").addEventListener("click", cerrar);
	document.getElementById("btnAgregar").addEventListener("click", agregar);
}

function cargarPersonas(){
	if(localStorage.getItem("personas")==null){
		xml.onreadystatechange = callback;
		xml.open("GET", "http://localhost:3000/personas");
		xml.send();
	}else{
		cargarLista();
	}
}


function callback(){
	if(xml.readyState===4){
		if(xml.status===200){
			console.log("asd");
			var personas = JSON.parse(xml.response);
			var personasConId = {};
			for(var i=0;i<personas.length;i++){
				personasConId[i]=personas[i];
				console.log(i);
			}
			localStorage.setItem("personas", JSON.stringify(personasConId));
			cargarLista();
		}else{
			alert("Error del servidor"+xml.status);
		}
	}
}

function cargarLista(){
	var personas = JSON.parse(localStorage.getItem("personas"));
	for(var key in personas){
		agregarPersonaLista(personas[key], key);
	}
}

function agregarPersonaLista(persona, id){
	tbody = document.getElementById("tbodyPersonas");
	var tr = document.createElement("tr");
	tr.setAttribute("id", id);
	var columns = Object.keys(persona);
	for(var j=0; j < columns.length; j++){
		var cel = document.createElement("td");
		cel.setAttribute("name", columns[j]);
		var text = document.createTextNode(persona[columns[j]]);
		cel.appendChild(text);
		tr.appendChild(cel);
	}
	var tdAccion = document.createElement("td");
	var aBorrar = document.createElement("a");
	var aModificar = document.createElement("a");
	var aAccionBorrarTexto = document.createTextNode("borrar");
	var aModificarTexto = document.createTextNode("/editar");
	aModificar.appendChild(aModificarTexto);
	aBorrar.appendChild(aAccionBorrarTexto);
	aBorrar.setAttribute("href", "#");
	aModificar.setAttribute("href", "#");
	aBorrar.addEventListener("click", borrarListener);
	aModificar.addEventListener("click", modificarListener);
	tdAccion.appendChild(aBorrar);
	tdAccion.appendChild(aModificar);
	tr.appendChild(tdAccion);
	tbody.appendChild(tr);
}

function guardar(){
	var nombre = document.getElementById("inpNombre");
	var apellido = document.getElementById("inpApellido");
	var telefono = document.getElementById("inpTelefono");
	var fecha = document.getElementById("inpFecha")

	if(validarCampos()){
		persona = {
			"nombre": nombre.value,
			"apellido": apellido.value,
			"fecha": fecha.value.split("-").join("/"),
			"telefono": telefono.value
		};
		var nuevoId = parseInt(document.getElementById("tbodyPersonas").lastElementChild.getAttribute("id"))+1;
		agregarPersonaLista(persona, nuevoId);
		agregarPersonaLocalStorage(persona, nuevoId);
		cerrar();
	}
}

function validarCampos(){
	var nombre = document.getElementById("inpNombre");
	var apellido = document.getElementById("inpApellido");
	var telefono = document.getElementById("inpTelefono");
	var fecha = document.getElementById("inpFecha")

	if(nombre.value != "" && apellido.value != "" && telefono.value != "" && fecha.value != ""){
		return true;
	}else{
		if(nombre.value==""){
			nombre.className = "conError";
		}else{
			nombre.className = "sinError";
		}
		if(apellido.value==""){
			apellido.className = "conError";
		}else{
			apellido.className = "sinError";
		}
		if(fecha.value==""){
			fecha.className = "conError";
		}else{
			fecha.className = "sinError";
		}
		if(telefono.value==""){
			telefono.className = "conError";
		}else{
			telefono.className = "sinError";
		}
	}
	return false;
}

function borrarListener(event){
	event.preventDefault();
	var elemento = event.target;
	var tr = elemento.parentNode.parentNode;
	var tds = tr.children;
	var persona = {};
	for(i=0; i< tds.length-1;i++){
		persona[tds[i].getAttribute("name")]=tds[i].innerHTML;
	}
	borrarPersonaLocalStorage(tr.getAttribute("id"));
	tr.parentNode.removeChild(tr);
	
}

function modificarListener(event){
	event.preventDefault();
	var elemento = event.target;
	var tr = elemento.parentNode.parentNode;
	var tds = tr.children;
	var persona = {};
	for(i=0; i< tds.length-1;i++){
		persona[tds[i].getAttribute("name")]=tds[i].innerHTML;
	}
	document.getElementById("fondoTransparente").hidden = false;
	var btnGuardar = document.getElementById("btnGuardar")
	btnGuardar.removeEventListener("click", guardar);
	btnGuardar.removeEventListener("click", modificar);
	btnGuardar.addEventListener("click", modificar);
	btnGuardar.setAttribute("idModificando", tr.getAttribute("id"));
	document.getElementById("inpNombre").value = persona["nombre"];
	document.getElementById("inpApellido").value = persona["apellido"];
	document.getElementById("inpFecha").value = persona["fecha"].split("/").join("-");
	document.getElementById("inpTelefono").value = persona["telefono"];
}

function modificar(event){
	var nombre = document.getElementById("inpNombre");
	var apellido = document.getElementById("inpApellido");
	var telefono = document.getElementById("inpTelefono");
	var fecha = document.getElementById("inpFecha")
	var tr = document.getElementById(event.target.getAttribute("idModificando"));
	var tds = tr.childNodes;

	if(validarCampos()){
		persona = {
			"nombre": nombre.value,
			"apellido": apellido.value,
			"fecha": fecha.value.split("-").join("/"),
			"telefono": telefono.value
		};
		for(var i=0;i<tds.length-1;i++){
			tds[i].innerHTML = persona[tds[i].getAttribute("name")];
		}
		event.target.removeAttribute("idModificando");
		modificarPersonaLocalStorage(persona, event.target.getAttribute("idModificando"));
		cerrar();
	}
}


function modificarPersonaLocalStorage(persona, id){
	var personas = JSON.parse(localStorage.getItem("personas"));
	personas[id] = persona;
	localStorage.setItem("personas", JSON.stringify(personas));
}


function borrarPersonaLocalStorage(id){
	var personas = JSON.parse(localStorage.getItem("personas"));
	delete personas[id];
	localStorage.setItem("personas", JSON.stringify(personas));
}

function agregarPersonaLocalStorage(persona, id){
	personas = JSON.parse(localStorage.getItem("personas"));
	personas[id] = persona;
	localStorage.setItem("personas", JSON.stringify(personas));
}

function cerrar(){
	document.getElementById("fondoTransparente").hidden = true;
	document.getElementById("inpNombre").className= "sinError";
	document.getElementById("inpApellido").className= "sinError";
	document.getElementById("inpTelefono").className= "sinError";
	document.getElementById("inpFecha").className= "sinError";
}

function agregar(){
	document.getElementById("btnGuardar").removeEventListener("click", guardar);
	document.getElementById("btnGuardar").removeEventListener("click", modificar);
	document.getElementById("btnGuardar").addEventListener("click", guardar);
	document.getElementById("fondoTransparente").hidden = false;
	document.getElementById("inpNombre").value = "";
	document.getElementById("inpApellido").value = "";
	document.getElementById("inpFecha").value = "";
	document.getElementById("inpTelefono").value = "";
}
