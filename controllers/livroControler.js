var livro = require('../models/livro');
var autor = require('../models/author');
var genero = require('../models/genero');
var livroInstancia = require('../models/livroInstance');
const {body,validationResult} = require('express-validator');
var async = require('async');



exports.index = function(req, res) {

    async.parallel({
        livro_count:(callback)=>{
            livro.countDocuments({},callback);
        },
        livroInstance_count:(callback)=>{
            livroInstancia.countDocuments({},callback);
        },
        livroInstance_disponivel_count:(callback)=>{
            livroInstancia.countDocuments({status:'disponível'},callback);
        },
        autor_count:(callback)=>{
            autor.countDocuments({},callback);
        },
        genero_count:(callback)=>{
            genero.countDocuments({},callback);
        }
    },function(err, results){
        res.render('index',{title:'Biblioteca Local', error: err, data: results});
        
    });

};

// Display list of all books.
exports.book_list = function(req, res,next) {
    livro.find({},'titulo autor')
    .sort({titulo:1})
    .populate('autor')
    .exec((err,lista_livros)=>{
        if(err){
            return next(err);
        }
        res.render('lista_livros',{title:'Lista de Livros', book_list: lista_livros});
    });
   
};

// Display detail page for a specific book.
exports.book_detail = function(req, res,next) {

    async.parallel({
        livro:(callback)=>{
            livro.findById(req.params.id)
            .populate('autor')
            .populate('genero')
            .exec(callback);
        },
        livro_instance:(callback)=>{
            livroInstancia.find({
                'livro':req.params.id
            })
            .exec(callback)
        },
    }, (err, results)=> {
        if (err) { return next(err); }
        if (results.livro==null) { // No results.
            var err = new Error('Nenhum livro encontrado');
            err.status = 404;
            return next(err);
        }
        
        // Successful, so render.
        res.render('book_detail', { titulo: results.livro.titulo, livro: results.livro, book_instances: results.livro_instance } );
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res,next) {
    async.parallel({
        autores:(callback)=>{
            autor.find(callback);
        },
        generos:(callback)=>{
            genero.find(callback);
        },
        },(err,results)=>{
            if(err){
                return next(err);
            }
            res.render('book_form',{titulo:'Criar Livro',autores:results.autores,generos:results.generos,botao:'Adicionar'});
        }
    );
 
};

// Handle book create on POST.
exports.book_create_post = [ 
    
    function(req, res,next) {
        if(!(req.body.genero instanceof Array)){
            if(typeof req.body.genero === 'undefined')
                req.body.genero = [];
            else
                req.body.genero = new Array(req.body.genero);
        }
        next();
},
    body('titulo','Título não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('autor','Autor não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('resumo','Resumo não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('isbn','isbn não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('genero.*').escape(),

    (req, res,next)=>{
        const errors = validationResult(req);

        var Livro = new livro(
            {
                titulo: req.body.titulo,
                autor: req.body.autor,
                resumo: req.body.resumo,
                isbn: req.body.isbn,
                genero: req.body.genero
            }
        );
        if(!errors.isEmpty()){
            async.parallel({
                autores:(callback)=>{
                    autor.find(callback);
                },
                generos:(callback)=>{
                    genero.find(callback);
                },
        }, (err,results)=>{
            if(err){
                return next(err);
            }
            for(let i = 0;i < results.generos.length; i++){
                if(Livro.genero.indexOf(results.generos[i]._id) > -1){
                    results.generos[i].checked = 'true';
                }
            }
            res.render('book_form',{titulo:'Criar Livro',autores:results.autores,generos:results.generos,livro:Livro,errors:errors.array()});
        });
        return;
    }else{
        Livro.save((err)=>{
            if(err){
             return next(err);
            }
            res.redirect(Livro.url);
        });
    }
}
];
// Display book delete form on GET.
exports.book_delete_get = function(req, res,next) {
    async.parallel({
        livro:(callback)=>{
            livro.findById(req.params.id)
            .populate('autor')
            .populate('genero')
            .exec(callback);
        },
        livro_instance:(callback)=>{
            livroInstancia.find({
                'livro':req.params.id
            }).populate('livro')
            .exec(callback)
        },
    }, (err, results)=> {
        if (err) { return next(err); }
        if (results.livro==null) { // No results.
           res.redirect('/catalogo/livros')
        }
        // Successful, so render.
        res.render('livro_delete', { titulo: results.livro.titulo, livro: results.livro, livro_instance: results.livro_instance } );
    });
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res,next) {
    async.parallel({
        livro:(callback)=>{
            livro.findById(req.body.livroid)
            .populate('autor')
            .populate('genero')
            .exec(callback)
        },
        livro_instance:(callback)=>{
            livroInstancia.find({
                'livro':req.body.livroid
            }).exec(callback)
        },
    }, (err, results)=> {
        if (err) { return next(err); }
        if (results.livro_instance.length > 0) { // No results.
            res.render('livro_delete', { titulo: results.livro.titulo, livro: results.livro, livro_instance: results.livro_instance } );
            return;
        }else{
            livro.findByIdAndRemove(req.body.livroid,function deleteLivro(err){
                if(err){return next(err);}
                res.redirect('/catalogo/livros')
            });
            }
    });
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
    async.parallel({
        Livro: function(callback){
            livro.findById(req.params.id)
            .populate('autor').populate('genero')
            .exec(callback);
        },
        autores: function(callback){
            autor.find(callback);
        },
        generos: function(callback){
            genero.find(callback);
        },
        },
        function(err,results){
            if(err){return next(err);}
            if(results.Livro == null){
                var err = new Error('livro não encontrado');
                err.status = 404;
                return next(err);
            }
            for(var all_g_iter = 0;all_g_iter < results.generos.length; all_g_iter++){
                for(var livro_g_iter = 0;livro_g_iter < results.Livro.genero.length;livro_g_iter++){
                    if(results.generos[all_g_iter]._id.toString() === results.Livro.genero[livro_g_iter]._id.toString()){
                        results.generos[all_g_iter].checked = 'true';
                    }
                }
            }
            res.render('book_form',{titulo:'Atualizar Livro',autores: results.autores, generos: results.generos, Livro: results.Livro, botao:'Atualizar' });
        });
};

// Handle book update on POST.
exports.book_update_post = [
    (req, res,next)=> {
        if(!(req.body.genero instanceof Array)){
            if(typeof req.body.genero === 'undefined')
                req.body.genero = [];
            else
                req.body.genero = new Array(req.body.genero);
        }
        next();
    },
    // Validate and sanitize fields.
    body('titulo','Título não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('autor','Autor não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('resumo','Resumo não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('isbn','isbn não pode ficar vazio.').trim().isLength({min:1}).escape(),
    body('genero.*').escape(),
    
    (req,res,next)=>{

        const errors = validationResult(req);

        var Livro = new livro(
            {
                titulo: req.body.titulo,
                autor: req.body.autor,
                resumo: req.body.resumo,
                isbn: req.body.isbn,
                genero: (typeof req.body.genero ==='undefined') ? [] : req.body.genero,
                _id: req.params.id
            }
        );
        if(!errors.isEmpty()){
            async.parallel({
                autores:(callback)=>{
                    autor.find(callback);
                },
                generos:(callback)=>{
                    genero.find(callback);
                },
        }, (err,results)=>{
            if(err){
                return next(err);
            }
            for(let i = 0;i < results.generos.length; i++){
                if(Livro.genero.indexOf(results.generos[i]._id) > -1){
                    results.generos[i].checked = 'true';
                }
            }
            res.render('book_form',{titulo:'Atualizar Livro',autores:results.autores,generos:results.generos,livro:Livro,errors:errors.array()});
        });
        return;
    }else{
        livro.findByIdAndUpdate(req.params.id, Livro,{},function (err,Olivro){
            if(err){
                return next(err);
            }
            res.redirect(Olivro.url);
        });
    }
}

];

