const url = "https://go-wash-api.onrender.com/api/login";

async function login() {

    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value
    let resultado = document.getElementById('resposta')

    resultado.innerHTML = 'Processando...'

    if (!email || !senha) {
        resultado.innerHTML = 'Campos obrigatórios!'
        resultado.style.color = 'red'
        return
    }

    let api = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "user_type_id": 1,
            "password": senha,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (api.ok) {
        let resposta = await api.json();
        localStorage.setItem('user', JSON.stringify(resposta))
        console.log(resposta)

        resultado.innerHTML = 'Logado com sucesso :)'
        resultado.style.color = 'green'

        setTimeout(() => window.location.href = 'home.html', 3000);
        return
    }

    let respostaErro = await api.json();
    console.log(respostaErro)
    resultado.innerHTML = respostaErro.data.errors
    resultado.style.color = 'red'
}

async function deslogar() {

    document.getElementById('deslogar').innerHTML = 'deslogando...'

    let url_deslogar = "https://go-wash-api.onrender.com/api/auth/logout"

    let token = JSON.parse(localStorage.getItem('user')).access_token
    
    let api_deslogar = await fetch(url_deslogar, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if(api_deslogar.ok) {
        resposta = await api_deslogar.json();
        console.log(resposta)
        localStorage.clear()
        document.getElementById('deslogar').innerHTML = 'Deslogado com sucesso!'
        setTimeout(() => window.location.href = 'login.html', 2000);
        return
    }
}

document.getElementById('botao').addEventListener('click', login)
document.getElementById('deslogar').addEventListener('click', deslogar)

try {
    let dados = JSON.parse(localStorage.user);
    if(dados) {
        document.getElementById('deslogar').style.display = 'block'
        document.getElementById('titulo').innerHTML = `Olá, ${dados.user.name}!`
        document.getElementById('login').style.display = 'none'
        document.getElementById('form').style.display = 'none'
        document.getElementById('informacoes_logado').style.display = 'block'
        document.getElementById('info_email').innerHTML = dados.user.email
        document.getElementById('info_cpf').innerHTML = dados.user.cpf_cnpj
        document.getElementById('info_data').innerHTML = dados.user.birthday
    }
} catch {
    document.getElementById('titulo').innerHTML = "Area de login"
    document.getElementById('deslogar').style.display = 'none'
}