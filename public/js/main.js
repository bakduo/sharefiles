let MSend = (function(){
    
    'use strict';

    return  {

        enviarFile: function (){

                const link=document.getElementById("resultado");

                const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                let input = document.querySelector('input[type="file"]')

                let data = new FormData();
                for (const file of input.files) {
                    data.append('archivosuser',file,file.name)
                }

                            // Make a request using the Fetch API
                fetch('/uploadfilescheck', {
                    credentials: 'same-origin', // <-- includes cookies in the request
                    headers: {
                        'CSRF-Token': token // <-- is the csrf token as a header
                    },
                    method: 'POST',
                    body:data
                })
                .then((response)=>{

                    if (response.ok){
                        link.innerHTML = "Procesando...";
                        return response.json();
                        
                    }else{

                        throw new Error(`Network response was not OK`);
                    }

                })
                .then((datajson)=>{
                    if (datajson.status){

                        link.innerHTML="";

                        datajson.files.forEach((item)=>{
                            link.innerHTML = link.innerHTML + `<a href="${item.link}">Compartir link descarga: ${item.link}</a><br>`;
                        });
                        
                    }else{
                        link.innerHTML = "No fue posible procesarlo"
                    }
                })
                .catch((error)=>{
                    link.innerHTML = `No fue Enviado...${error}`;
                })

                

       }

    }
            
})();