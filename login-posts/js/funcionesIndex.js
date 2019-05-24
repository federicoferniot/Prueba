
$(document).ready(function(){
    $("#btnNewPost").click(newPost);
    $("#btnCerrar").click(cerrar);
    $("#btnPost").click(post);
    $("#imagenUser").attr("src", JSON.parse(localStorage.getItem("imagenUser")).imagen);
    $("#inpImg").change(function(){
                
        if (this.files && this.files[0]) {

            var fReader= new FileReader();
            
            fReader.addEventListener("load", function(e) {
              $("#preview").attr("src",e.target.result);
            }); 
            
            fReader.readAsDataURL( this.files[0] );
        }
    });
})

function newPost(){
    $("#inpTitle").val('');
    $("#inpHeader").val('');
    $("#inpText").val('');
	$("#fondoTransparente").show();
}

function cerrar(){
	$("#fondoTransparente").hide();
}

function post(){
    var inpTitle = $("#inpTitle");
    var inpHeader = $("#inpHeader");   
    var inpText = $("#inpText");
    var spinner = $("#spinner");
    var fondo = $("#fondo");
    if(inpTitle.val() != "" && inpHeader.val() != "" && inpText.val() != ""){
        var datosPost = {
            title: inpTitle.val(),
            imagen: $("#preview").attr("src"),
            header: inpHeader.val(),
            posttext: inpText.val(),
            author: getParameterByName("email")
        }
        $.post("http://localhost:1337/postearNuevaEntrada",
        JSON.stringify(datosPost),
        function(data){
            var divPosts = $("#divPosts");
            var nuevoPost = document.createElement("div");
            nuevoPost.setAttribute("class", "image-txt-container");

            var titulo = document.createElement("h2");
            titulo.innerHTML = data.title;
            var imagen = document.createElement("img");
            imagen.setAttribute("src", data.imagen);
            imagen.setAttribute("class", "imagen");
            var divTexto = document.createElement("div");
            divTexto.setAttribute("class", "text-container");
            var text = document.createElement("p");
            text.innerHTML = data.posttext;
            var author = document.createElement("h6");
            author.innerHTML = "Posted by "+data.author+" on "+ data.date;
            divTexto.appendChild(titulo);
            divTexto.appendChild(text);
            divTexto.appendChild(author);
            nuevoPost.appendChild(imagen);
            nuevoPost.appendChild(divTexto);

            divPosts.append(nuevoPost);

            var spinner = $("#spinner");
            var fondo = $("#fondo");
            spinner.hide();
            fondo.hide();
        })
        spinner.show();
        fondo.show();
        cerrar();
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}   