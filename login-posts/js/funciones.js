$(document).ready(function(){
    $("#btnSignIn").click(signIn);
})

function signIn(){
    var inpEmail = $("#inpEmail");
    var inpPassword = $("#inpPass");
    console.log(inpEmail.val());
    console.log(inpPassword.val());
    if(inpEmail.val() != "" && inpPassword.val() != ""){
        var datosLogin = {
            email : inpEmail.val(),
            password : inpPassword.val()
        };
        $.post("http://localhost:1337/login",
        datosLogin,
        function(data){
            if(data.autenticado=="si"){
                var pcolor = data.preferencias.color;
                var pfont = data.preferencias.font;
                var email = document.getElementById("inpEmail").value;
                window.location.replace("index.html?color="+pcolor+"&font="+pfont+"&email="+email);
                localStorage.setItem("imagenUser", JSON.stringify(data));
            }
        })
    }
}
