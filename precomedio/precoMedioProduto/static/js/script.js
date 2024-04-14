$(document).ready(function(){
  
    $('#btn-adicionar-produto').click((e)=>{
        e.preventDefault()
        $('#modal-adicionar-produto').show();

    })
  
    $('#btn-sobre').click((e)=>{ 
        e.preventDefault()
        $('#modal-sobre').show();

    })
    $('#btn-box-plot').click((e)=>{ 
        e.preventDefault()
        $('#modal-box-plot').show();

    })
    $('.btn-editar-produto').click((e)=>{ 
        e.preventDefault()
        $('#modal-editar-produto').show();

    })
    $('.fechar-modal1').click((e)=>{
        e.preventDefault()
        $('.modal').hide();

    })
    $('.fechar-modal').click((e)=>{
        e.preventDefault()
        $('.modal').hide();

    })
    $('#salvar-produto').click((e)=>{
        e.preventDefault()
        prodValue = document.getElementById("staticprodut").value
        $.ajax({
            url: "http://localhost:8000/home/"+prodValue, // URL de la solicitud
            method: 'GET', // Método HTTP (GET, POST, etc.)
            success: function(response) {
                window.location.assign("http://localhost:8000")
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    })
    $('.deletarProduto').click((e)=>{
        e.preventDefault()
        prodValue = e.target.getAttribute("id")
        $.ajax({
            url: "http://localhost:8000/v1/"+prodValue, // URL de la solicitud
            method: 'DELETE', // Método HTTP (GET, POST, etc.)
            success: function(response) {
                window.location.assign("http://localhost:8000")
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    })
    $('#limpar-produto').click((e)=>{
        e.preventDefault()
        $.ajax({
            url: "http://localhost:8000/v1/", // URL de la solicitud
            method: 'DELETE', // Método HTTP (GET, POST, etc.)
            success: function(response) {
                window.location.assign("http://localhost:8000/")
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    })
    $('.btn-editar-produto').click((e)=>{
        e.preventDefault()
        prodValue = e.target.getAttribute("id")
        $.ajax({
            url: "http://localhost:8000/v1/"+prodValue, // URL de la solicitud
            method: 'GET', // Método HTTP (GET, POST, etc.)
            success: function(response) {
                document.getElementById("campo_id").value = response.id;
                document.getElementById("campo_loja").value = response.lojaproduto;
                document.getElementById("campo_preco").value = response.valproduto;
                document.getElementById("campo_descricao").value = response.descricaoproduto;
                document.getElementById("campo_data").value = response.data;
                console.log(response)
            },
            error: function( status, error) {
                console.error('Error:', error);
            }
        }); 
    })
    $('#editar-produto').click((e)=>{
        e.preventDefault()
        idValue= document.getElementById("campo_id").value
        lojaValue = document.getElementById("campo_loja").value
        precoValue = document.getElementById("campo_preco").value
        descricaoValue = document.getElementById("campo_descricao").value
        dataValue = document.getElementById("campo_data").value
        $.ajax({
            url: "http://localhost:8000/v1/"+idValue, // URL de la solicitud
            method: 'PUT', // Método HTTP (GET, POST, etc.)
            dataType:"json",
            data: JSON.stringify({id:idValue,valproduto:precoValue,lojaproduto:lojaValue,descricaoproduto:descricaoValue,data:dataValue}),
            success: function(response) {
                console.log(response)
                window.location.assign("http://localhost:8000/")
            },
            error: function( status, error) {
                console.error('Error:', error);
            }
        }); 
    })
    $('#enviar-produto-pesquisa').click((e)=>{
        e.preventDefault()
        descricaoPesquisa = document.getElementById("pesquisar_produto_home").value
        $.ajax({
            url: "http://localhost:8000/v1/", // URL de la solicitud
            method: 'GET', // Método HTTP (GET, POST, etc.)
            success: function(response) {
                console.log(response[0])
                window.location.assign("http://localhost:8000/")
            },
            error: function( status, error) {
                console.error('Error:', error);
            }
        }); 
    })
  });         



