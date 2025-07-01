const dotenv = require('dotenv');
const express = require('express'); //exportando express
const app = express();

const Usuario = require('./models/Usuario');

const session = require('express-session');

const bodyParser = require('body-parser');
//requirindo handlebars
const hbs = require('express-handlebars');

//definição da porta
const PORT = process.env.PORT || 3000;

//config handlebars
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}))
app.set('view engine', 'hbs');

//config das sessions
app.use(session({
    secret: 'CriarUmaChave132',
    resave: false,
    saveUninitialized: true
}));

//definindo o caminho estatico public
app.use(express.static('public')) //middleware para arquivos estaticos
app.use(bodyParser.urlencoded({extended: false})) //middleware para o funcionamento do bodyParser



//rota para a home 
app.get('/', (req, res)=>{
    if(req.session.errors){
        let arrayErros = req.session.errors;
        res.render('index', {NavActiveCad: true, error:arrayErros});
        req.session.errors ="";
    }
    if(req.session.success){
        req.session.success = false;
        res.render('index', {NavActiveCad: true, MsgSuccess: true});
    }
    res.render('index', {NavActiveCad: true});
})

//rota para a lista de usuarios
app.get('/users', (req, res)=>{
    //res.render('users', {NavActiveUsers: true})
    Usuario.findAll().then((valores)=>{
        // console.log(valores.map(valores => valores.toJSON()));
        // console.log('Listado!');
        if(valores.length>0){
            res.render('users', {NavActiveUsers: true, table:true, usuarios: valores.map(valores=>valores.toJSON())})
        }
        else{
            res.render('users', {NavActiveUsers: true, table: false});
        }
    }).catch((err)=>{
        console.log('Erro ao listar: '+err);
    })
})



app.get('/edit', (req, res) => {
    res.redirect('/users'); // ou mostra uma mensagem tipo "Escolha um usuário pra editar"
});//rota para pagina de editar
app.post('/edit', (req, res)=>{
    //res.render('edit');
    let id = req.body.id;
    Usuario.findByPk(id).then((dados)=>{
        return res.render('edit', {error:false, id: dados.id, nome: dados.nome, email:dados.email})
    }).catch((err)=>{
        console.log(err);
        return res.render('edit', {error:true, problema:'Não é possivel editar o registro.'})
    })
})

app.post('/delete', (req, res)=>{
    let id = req.body.id;
    Usuario.destroy({
        where: {
            id:id
        }
    }).then(()=>{
        return res.redirect('/users');

    }).catch((err)=>{
        console.log(err);
        res.status(400).send({mensagem: 'Problema ao deletar usuario'})
    })
})

app.post('/update', (req, res)=>{
    let nome = req.body.nome;
    let email = req.body.email; //requisição com o corpo com o name q a gnt deu la no hbs

    //array com erros
    const erros = [];

    nome = nome.trim() ; //removendo espaços em branco 
    email = email.trim();

    //limpa caracteres especiais
    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '') //aqui temos uma expressão regular no replace. Isso indica que ele so aceita caracteres letras com ou sem acento

    //verificar se esta vazio ou nao definido
    if(nome=='' || typeof nome == undefined || nome == null){
        erros.push({mensagem: "Campo nome não pode ser vazio!"});
    }
    
    //validando email
    if(email == '' || email == null || typeof email == undefined){
        erros.push({mensagem: "Campo email não pode ser vazio!"})
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        erros.push({mensagem: "Campo email invalido!"});
    }

    if(erros.length > 0){
        console.log(erros);
        return res.status(400).send({status:400, erro:erros});

    }
    Usuario.update({
        nome:nome,
        email:email.toLowerCase()
    },
    {
        where: {
            id:req.body.id
        }
    }).then(()=>{
        return res.redirect('/users');
    }).catch((err)=>{
        console.log(err);
    })
})

app.post("/cad", (req, res)=>{
    let nome = req.body.nome;
    let email = req.body.email; //requisição com o corpo com o name q a gnt deu la no hbs

    //array com erros
    const erros = [];

    nome = nome.trim() ; //removendo espaços em branco 
    email = email.trim();

    //limpa caracteres especiais
    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '') //aqui temos uma expressão regular no replace. Isso indica que ele so aceita caracteres letras com ou sem acento

    //verificar se esta vazio ou nao definido
    if(nome=='' || typeof nome == undefined || nome == null){
        erros.push({mensagem: "Campo nome não pode ser vazio!"});
    }
    
    //validando email
    if(email == '' || email == null || typeof email == undefined){
        erros.push({mensagem: "Campo email não pode ser vazio!"})
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        erros.push({mensagem: "Campo email invalido!"});
    }

    if(erros.length > 0){
        console.log(erros);
        req.session.errors = erros;  
        req.session.success = false;
        return res.redirect('/');

    }

    Usuario.create({
        nome: nome,
        email: email.toLowerCase(),
    }).then(()=>{
        console.log('Inserido!');
    }).catch((err)=>{
        console.log('Erro: '+err);
    });   //INSERINDO NO BD
    //sucesso
    //salvar no bd
    console.log('Validação realizada com sucesso');
    req.session.success = true;
    return res.redirect('/');


    //nesse middleware, da p manipular esses dados
})

//listen para o projeto ir ao ar
app.listen(PORT, (err)=>{
    if(err){
        throw err;
    }
    else    
        console.log(`Server em http://localhost:${PORT}`);

})