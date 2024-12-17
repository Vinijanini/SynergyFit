document.getElementById('botao').addEventListener('click', cadastroEndereco)

/*Consifurações das divs que irão aparecer*/
const user = JSON.parse(localStorage.getItem('user'));

document.getElementById('paragrafo_cadastre').innerHTML = `Olá, ${user.user.name}!<br>Cadastre um endereço aqui`

if (user) {
    document.getElementById('deslogado').style.display = 'none';
    document.getElementById('cadastro_endereco').style.display = 'block';
    document.getElementById('div_endereco_cadastrado').style.display = 'block';
} else {
    document.getElementById('deslogado').style.display = 'block';
    document.getElementById('cadastro_endereco').style.display = 'none';
    document.getElementById('div_endereco_cadastrado').style.display = 'none';
}

async function lista_endereco() {

    document.getElementById('enderecos_cadastrados').innerHTML = 'Processando...' 

    let user = JSON.parse(localStorage.getItem('user'))

    let url_listagem = 'https://go-wash-api.onrender.com/api/auth/address'

    let api_listagem = await fetch(url_listagem, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`
        }
    });


    if (api_listagem.ok) {
        let resposta = await api_listagem.json();

        if(resposta.data.length == 0) {
            document.getElementById('enderecos_cadastrados').innerHTML = 'Nenhum endereço cadastrado'
        } else {
            document.getElementById('enderecos_cadastrados').innerHTML = 'Seus endereços' 
        }

        const listaEnderecosDiv = document.getElementById('lista-enderecos');

        // Percorrer cada endereço e criar uma div
        resposta.data.forEach(endereco => {

            const enderecoDiv = document.createElement('div');
            enderecoDiv.className = 'endereco';
            enderecoDiv.innerHTML = `
                <h2>${endereco.title}</h2>
                <p><strong>Endereço:</strong> ${endereco.address}</p>
                <p><strong>CEP:</strong> ${endereco.cep}</p>
                <p><strong>Número:</strong> ${endereco.number}</p>
                <p><strong>Complemento:</strong> ${endereco.complement}</p>
                <input id="deletar" type="button" value="Deletar" onclick="deletar_endereco(${endereco.id}, '${endereco.title}')">
                <input id="atualizar" type="button" value="Atualizar" onclick="redirecionar_atualizacao_endereco(${endereco.id})">
            `;
            listaEnderecosDiv.appendChild(enderecoDiv);
        });

        return

    }
}

lista_endereco()

///////////////////////////////////////////////////////////////////

const url = 'https://go-wash-api.onrender.com/api/auth/address'

async function cadastroEndereco() {

    let user = JSON.parse(localStorage.getItem('user'))

    let resultado = document.getElementById('resultado')
    let titulo = document.getElementById('titulo').value
    let cep = document.getElementById('cep').value
    let endereco = document.getElementById('endereco').value
    let numero = document.getElementById('numero').value
    let complemento = document.getElementById('complemento').value

    resultado.innerHTML = `Processando...`
    resultado.style.color = 'black'

    if (!titulo || !cep || !endereco || !numero) {
        resultado.innerHTML = 'Preencha os campos!'
        resultado.style.color = 'red'
        return
    }

    try {

        let api = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "title":titulo,
                "cep": cep,
                "address": endereco,
                "number": numero,
                "complement": complemento
            }
            ),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`
            }
        });
    
        if (api.ok) {
            let resposta = await api.json();
            resultado.innerHTML = 'Endereço cadastrado :)'
            resultado.style.color = 'green'
            console.log(resposta)
            setTimeout(() => window.location.href = 'home.html', 3000)
            return
        }

    } catch {
        resultado.innerHTML = `Não cadastrado :(`
        resultado.style.color = 'red'
    }
}

////////////////////////////////////////////////////////////////////

function redirecionar_atualizacao_endereco(id) {
    setTimeout(() => window.location.href = `atualizar_endereco.html?id=${id}`, 1000)
}

/////////////////////////////////////////////////////////////////////

async function deletar_endereco(id, titulo_endereco) {

    let confirm = window.confirm(`Apagar endereço: ${titulo_endereco}?`)

    if(confirm) {

        token = JSON.parse(localStorage.getItem('user')).access_token
    
        let url_deletar = `https://go-wash-api.onrender.com/api/auth/address/${id}`

        let api_deletar = await fetch(url_deletar, {
            method: 'DELETE',
            headers: {
                'Authorization':`Bearer ${token}`,
                'Cookie':'gowash_session=0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj'
            }
        });

        if(api_deletar.ok) {
            resposta = await api_deletar.json()
            window.location.href = '../view/endereco.html'
            return
        }

    }

}