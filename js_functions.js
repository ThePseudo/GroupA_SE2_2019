function ajaxRequest() {

    var request;
    try { // Non IE Browser?
        request = new XMLHttpRequest();
    }   catch(e1){ // No
                try { // IE 6+?
                     request = new ActiveXObject("Msxml2.XMLHTTP");
                }   catch(e2){ // No
                            try { // IE 5?
                                request = new ActiveXObject("Microsoft.XMLHTTP");
                            }   catch(e3){ // No AJAX Support
                                request = false;
                                }
                    }
        }
    return request;
}

function serveNext(ref_div_to_employee_page){ // TO DO: function's argument

    //-----TODO: Controllo cookie attivi o meno, copia-incolla da adattare
    // if (navigator.cookieEnabled == 0){
    //     window.alert("Cookies are not enabled! ");
    //     window.location.href = "index.php";
    //     exit;
    // }

    //------

    //------TO DO:
    var service = "A" //Qui implementare logica per estrarre da una delle code se operatore più mansioni.
    //------

    var req = ajaxRequest(); //oggetto usato per mandare richiesta Ajax al server
    req.open("POST","actions/next.php", true); // creazione richiesta
    //Setto header http, mi servono per poter inviare dati tramite post secondo codifica indicata
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //req.setRequestHeader("Content-length","20");
   
    req.send("service="+service); //invio richiesta, passo il tipo di servizio, un operatore può avere più mansioni e attingere da più code in base un criterio (TO DO)
    //Gestore cambiamento di stato.
    //Tiene traccia dei vari passaggi da richiesta a ricevuta risposta.
    //Qui mi importa capire cosa succede quando mi arriva ed è disponibile
    req.onreadystatechange = function(){ 
        if(this.readyState == 4){ //La risposta alla richiesta è disponibile
            if(this.status == 200 || this.status == 0){
                if(this.responseText!=false){
                   //ho avuto risposta, mostro a operatore il numero che dovrebbe essere servito
                }
                else //no cittadini in coda al momento
            }
            else{
                //TODO: copia-incolla da adattare, caso errore richiesta ajax
                // msg.innerHTML = "ERROR, ajax request"
                // msg.style.color = "red";
            } 
        }
    };
}