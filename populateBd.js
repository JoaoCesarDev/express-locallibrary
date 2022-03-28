#! nó /usr/bin/env

console.log('Este script preenche alguns livros de teste, autores, gêneros e instâncias de livros em seu banco de dados. Banco de dados especificado como argumento - ex: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites =verdadeiro');

// Obtém os argumentos passados ​​na linha de comando
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERRO: Você precisa especificar uma URL válida do mongodb como o primeiro argumento');
    Retorna
}
*/
var async = require('async')
var Livro = require('./models/livro')
var Autor = require('./models/author')
var Genero = require('./models/genero')
var BookInstance = require('./models/livroInstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão MongoDB:'));

var autores = []
var generos = []
var livros = []
var livrosInstance = []

function authorCreate(primeiro_nome, ultimo_nome, data_aniversario, data_morte, cb) {
    autordetalhe = {primeiro_nome:primeiro_nome , ultimo_nome: ultimo_nome }
  if (data_aniversario != false) autordetalhe.data_aniversario = data_aniversario
  if (data_morte != false) autordetalhe.data_morte = data_morte
  
  var autor = new Autor(autordetalhe);
       
  autor.save((erro)=> {
    if (erro) {
      cb(erro, null)
      Retorna
    }
    console.log('Novo autor: ' + autor);
    autores.push(autor)
    cb(null, autor)
  });
}

function generoCreate(nome, cb) {
  var genero = new Genero({ nome: nome });
       
  genero.save((erro)=> {
    if (erro) {
      cb(erro, null);
      Retorna;
    }
    console.log('Novo Gênero: ' + genero);
    generos.push(genero)
    cb(null, genero);
  });
}

function bookCreate(titulo, resumo, isbn, autor, genero, cb) {
  livroDetalhe = {
    titulo: titulo,
    resumo: resumo,
    autor: autor,
    isbn: isbn
  }
  if (genero != false) livroDetalhe.genero = genero
    
  var livro = new Livro(livroDetalhe);    
  livro.save((erro)=> {
    if (erro) {
      cb(erro, nulo)
      Retorna
    }
    console.log('Novo livro: ' + livro);
    livros.push(livro)
    cb(null, livro)
  });
}


function bookInstanceCreate(livro, imprimir, devolucao, status, cb) {
  livroinstancedetalhe = {
    livro: livro,
    imprimir: imprimir
  }    
  if (devolucao != false) livroinstancedetalhe.devolucao = devolucao
  if (status != false) livroinstancedetalhe.status = status
    
  var livroinstance = new BookInstance(livroinstancedetalhe);    
  livroinstance.save(function (erro) {
    if (erro) {
      console.log('ERRO A CRIAR BookInstance: ' + livroinstance);
      cb(erro, null)
      return
    }
    console.log('New BookInstance: ' + livroinstance);
    livrosInstance.push(livroinstance)
    cb(null, livro)
  });
}


function createGenreAuthors(cb) {
    async.series([
        function(callback) {
          authorCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback);
        },
        function(callback) {
          authorCreate('Ben', 'Bova', '1932-11-8', false, callback);
        },
        function(callback) {
          authorCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        function(callback) {
          authorCreate('Bob', 'Billings', false, false, callback);
        },
        function(callback) {
          authorCreate('Jim', 'Jones', '1971-12-16', false, callback);
        },
        function(callback) {
            generoCreate("Fantasy", callback);
        },
        function(callback) {
            generoCreate("Science Fiction", callback);
        },
        function(callback) {
          generoCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', autores[0], [generos[0],], callback);
        },
        function(callback) {
          bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', autores[0], [generos[0],], callback);
        },
        function(callback) {
          bookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', autores[0], [generos[0],], callback);
        },
        function(callback) {
          bookCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', autores[1], [generos[1],], callback);
        },
        function(callback) {
          bookCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', autores[1], [generos[1],], callback);
        },
        function(callback) {
          bookCreate('Test Book 1', 'Summary of test book 1', 'ISBN111111', autores[4], [generos[0],generos[1]], callback);
        },
        function(callback) {
          bookCreate('Test Book 2', 'Summary of test book 2', 'ISBN222222', autores[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(livros[0], 'London Gollancz, 2014.', false, 'disponível', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[1], ' Gollancz, 2011.', false, 'emprestado', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(livros[3], 'New York Tom Doherty Associates, 2016.', false, 'disponível', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[3], 'New York Tom Doherty Associates, 2016.', false, 'disponível', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[3], 'New York Tom Doherty Associates, 2016.', false, 'disponível', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'disponível', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'manutenção', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'emprestado', callback)
        },
        function(callback) {
          bookInstanceCreate(livros[0], 'Imprint XXX2', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(livros[1], 'Imprint XXX3', false, false, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createBooks,
    createBookInstances
],
//Retorno de chamada opcional
function(erro, resultados) {
    if (erro) {
        console.log('ERRO FINAL: '+erro);
    }
    else {
        console.log('BOOKInstances: '+livrosInstance);
        
    }
    // Tudo pronto, desconecte do banco de dados
    mongoose.connection.close();
});