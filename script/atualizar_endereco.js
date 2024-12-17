async function atualizar_endereco() {

    document.getElementById('resultado').style.color = 'black';
    document.getElementById('resultado').innerHTML = 'Processando...';

    let titulo, cep, address, numero, complemento
    titulo = document.getElementById('titulo').value
    cep = document.getElementById('cep').value
    address = document.getElementById('endereco').value
    numero = document.getElementById('numero').value
    complemento = document.getElementById('complemento').value

    if (!titulo || !cep || !endereco || !numero) {
        resultado.innerHTML = 'Preencha os campos!'
        resultado.style.color = 'red'
        return
    }

    let user = JSON.parse(localStorage.getItem('user'))

    const id = new URLSearchParams(window.location.search).get('id');
    
    let url = `https://go-wash-api.onrender.com/api/auth/address/${id}`

    let api_atualizar = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "title": titulo,
            "cep": cep,
            "address": address,
            "number": numero,
            "complement": complemento
        }
        ),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`
        }
    });

    if (api_atualizar.ok) {
        let resposta = await api_atualizar.json();
        document.getElementById('resultado').style.color = 'green';
        document.getElementById('resultado').innerHTML = 'Endereço atualizado com sucesso!';
        console.log(resposta);

        setTimeout(() => window.location.href = '../view/endereco.html', 3000)
        return
    }

    let respostaErro = await api_atualizar.json();
    console.log(respostaErro);
    document.getElementById('resultado').style.color = 'red';
    document.getElementById('resultado').innerHTML = 'Erro :(';
}

////////////////////////////////////////////

async function pegar_endereco() { 

    const id = new URLSearchParams(window.location.search).get('id');

    let token = JSON.parse(localStorage.getItem('user')).access_token

    let url_listagem = `https://go-wash-api.onrender.com/api/auth/address/${id}` 

    let api_listagem = await fetch(url_listagem, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });


    if (api_listagem.ok) {
        let resposta = await api_listagem.json();

        console.log(resposta)

        document.getElementById('titulo').value = resposta.data.title
        document.getElementById('cep').value = resposta.data.cep
        document.getElementById('endereco').value = resposta.data.address
        document.getElementById('numero').value = resposta.data.number
        document.getElementById('complemento').value = resposta.data.complement

    }
    
}

pegar_endereco()

//////////////////////////////////

document.getElementById('botao').addEventListener('click', atualizar_endereco)