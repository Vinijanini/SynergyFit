const url = "https://go-wash-api.onrender.com/api/user";

async function cadastro() {

    // Obtém os valores dos inputs
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value.trim();
    const cpfCnpj = document.getElementById('cpf_cnpj').value.trim();
    const dataNascimento = document.getElementById('data').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('conf_senha').value;
    const termos = document.getElementById('terms').checked;

    // Exemplo de como usar os valores obtidos
    let resposta = document.getElementById('resposta');

    resposta.style.color = 'black'
    resposta.innerHTML = 'processando...'
    
    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !cpfCnpj || !dataNascimento || !senha || !confirmarSenha) {
        resposta.style.color = 'red'
        resposta.textContent = "Todos os campos devem ser preenchidos!";
        return;
    }

     // Verifica se o CPF/CNPJ é composto apenas por números
     if (isNaN(cpfCnpj)) {
        resposta.style.color = 'red';
        resposta.textContent = "O CPF/CNPJ deve conter apenas números!";
        return;
    }

    // Verifica se a idade é válida (máximo de 90 anos)
    const dataAtual = new Date();
    const anoNascimento = new Date(dataNascimento).getFullYear();
    const idade = dataAtual.getFullYear() - anoNascimento;

    if (idade < 0 || idade > 100) {
        resposta.style.color = 'red'
        resposta.textContent = "A idade deve ser válida e não pode ultrapassar 100 anos!";
        return;
    }

    // Valida as senhas
    if (senha !== confirmarSenha) {
        resposta.style.color = 'red'
        resposta.textContent = "As senhas não conferem!";
        return;
    } 
    if (!termos) {
        resposta.style.color = 'red'
        resposta.textContent = "Você precisa aceitar os termos!";
        return;
    }

    // Api

    let api = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "name":nome,
            "email":email,
            "user_type_id":1,
            "password":senha,
            "cpf_cnpj":cpfCnpj,
            "terms":termos,
            "birthday":dataNascimento
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (api.ok) {
        resposta.style.color = 'green'
        resposta.innerHTML = "Cadastro realizado com sucesso!<br>Ative sua conta pelo email recebido!";
        console.log(`Cadastrado com sucesso: ${nome}`)
        setTimeout(() => window.location.href = 'home.html', 3000);
        return; 
    } 

    let respostaErro = await api.json();
    console.log(respostaErro)

    if(respostaErro.data.errors == 'cpf_cnpj invalid') {
        resposta.innerHTML = 'CPF/CNPJ Inválido :(';
        resposta.style.color = 'red';
        return;
    }

    try {
        if(respostaErro.data.errors.email[0] == 'The email has already been taken.') {
            resposta.innerHTML = 'Email já utilizado :(';
            resposta.style.color = 'red';
            return;
        }
    
    } catch {
        //nada acontece//
    }
    
    if(respostaErro.data.errors.cpf_cnpj[0] == 'The cpf cnpj has already been taken.') {
        resposta.innerHTML = 'CPF/CNPJ já utilizado :(';
        resposta.style.color = 'red';
        return;
    } 

    resposta.style.color = 'red'
    resposta.textContent = "Erro no cadastro :(";

}

document.getElementById('botao').addEventListener('click', cadastro);