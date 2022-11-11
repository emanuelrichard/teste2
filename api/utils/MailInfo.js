module.exports = {

    /*** Greetings e-mail containing the temporary user password ***/
    WELCOME_PASS(name, P) {
        return ["Senha de acesso para plataforma Blue Easy",
        '<h2 style="text-align: center">Bem vindo '+name+' !</h2>'+
        '<p>&emsp;</p>'+
        '<h4 style="text-align: center">Utilize a senha abaixo para autenticar-se na Blue Easy:</h4>'+
        '<table style="text-align: center;" width="100%">'+
        '<tr>'+
        '<td>&emsp;</td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[0]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[1]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[2]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[3]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[4]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[5]+'</h2></td>'+
        '<td>&emsp;</td>'+
        '</tr>'+
        '</table>'+
        '<p>&emsp;</p><p>&emsp;</p>'+
        '<p style="text-align: center">Após login, é altamente recomendado alterar sua senha para uma senha de sua escolha.</p>'+
        '<p style="text-align: center">Você pode fazer isso nas <b>opções de conta</b> no seu aplicativo.</p>'+
        '<p>&emsp;</p><p>&emsp;</p><p>&emsp;</p><p>&emsp;</p>'+
        '<p style="text-align: center; font-weight: 600">Blue Easy @ Blue EasyAutomações e Sistemas</p>']
    },

    WELCOME_CODE(name, code) {
        return ["Código de acesso para Blue Easy",
    '<h2 style="text-align: center">Bem vindo '+name+' !</h2>'+
    '<p>&nbsp;</p>'+
    '<p style="text-align: center">Você foi cadastrado na Blue Easy como instalador.</p>'+
    '<h4 style="text-align: center">Utilize o código abaixo para autenticar-se na Blue Easy de instaladores (Config Blue Easy):</h4>'+
    '<table style="text-align: center;" width="100%">'+
    '<tr>'+
    '<td>&emsp;</td>'+
    '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+code+'</h2></td>'+
    '</tr>'+
    '</table>'+
    '<p>&nbsp;</p>'+
    '<p style="text-align: center"><b>Não compartilhe</b> seu código com outras pessoas, você é <b>totalmente responsável por ele</b>.</p>'+
    '<p style="text-align: center"><b>Guarde este código e/ou este e-mail</b> de forma que consiga <b>consultar seu código</b> futuramente.</p>'+
    '<p style="text-align: center">Caso perca seu código ou necessite alterá-lo, basta enviar um e-mail para <a href="mailto:blueasy.dev@gmail.com?subject=[Instalador] Código de instalação" title="">blueasy.dev@gmail.com</a> (ou responder este e-mail).</p>'+
    '<p>&nbsp;</p><p>&nbsp;</p>'+
    '<p style="text-align: center; font-weight: 600">Blue Easy @ Blue Easy Automações e Sistemas</p>']
    },

    RENEW_PASS(name, P) {
        return ["Recuperação de senha para plataforma Blue Easy",
        '<h2 style="text-align: center">Olá '+name+' !</h2>'+
        '<p>&nbsp;</p>'+
        '<h4 style="text-align: center">Uma nova senha foi requisitada para sua conta, '+
        'caso tenha se esquecido ou não consiga mais acessar sua conta, utilize a senha abaixo:</h4>'+
        '<table style="text-align: center;" width="100%">'+
        '<tr>'+
        '<td>&emsp;</td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[0]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[1]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[2]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[3]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[4]+'</h2></td>'+
        '<td></td><td></td>'+
        '<td style="background-color: whitesmoke; border-style: outset; border-radius: 10px;"><h2>'+P[5]+'</h2></td>'+
        '<td>&emsp;</td>'+
        '</tr>'+
        '</table>'+
        '<p>&nbsp;</p>'+
        '<p style="text-align: center">Após login, é altamente recomendado alterar sua senha para uma senha de sua escolha.</p>'+
        '<p style="text-align: center">Você pode fazer isso nas <b>opções de conta</b> no seu aplicativo.</p>'+
        '<p>&nbsp;</p>'+
        '<p style="text-align: center">Caso não tenha requisitado uma nova senha, apenas ignore essa mensagem.</p>'+
        '<p>&nbsp;</p><p>&nbsp;</p>'+
        '<p style="text-align: center; font-weight: 600">Blue Easy @ Blue Easy Automações e Sistemas</p>']
    }

}