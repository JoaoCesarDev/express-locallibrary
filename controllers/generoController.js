const {body,validationResult} = require("express-validator");


var genero = require('../models/genero');
var async  = require('async');
var livro = require('../models/livro');

// Display list of all Genre.
exports.genre_list = function(req, res,next) {
    genero.find()
    .sort([['nome','ascending']])
    .exec((err,lista_generos)=>{
        if(err){
            return next(err);
        }
        res.render('lista_generos',{title:'Lista Gêneros',lista_generos:lista_generos});
    });
    
};  

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res,next) {
    async.parallel({
        genero:(callback)=>{
            genero.findById(req.params.id)
            .exec(callback);
        },
        genero_livros:(callback)=>{
            livro.find({'genero':req.params.id})
            .exec(callback);
        },
    }, (err,results)=>{
        if(err){
            return next(err);
        }
        if(results.genero == null){
            var err = new error('Gênero não encontrado');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail',{title:'Detalhes do Gênero',genero:results.genero,genero_livros:results.genero_livros});
    });

};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res,next) {
    res.render('genero_form',{titulo:'Criar Gênero',botao:'Adicionar'});
};

// Handle Genre create on POST.
exports.genre_create_post = [ 
    body('nome','Nome do gênero é obrigatório!').trim().isLength({ min: 1 }).escape(),

    (req,res,next)=>{
        const errors = validationResult(req);

        var gen = new genero(
            {nome: req.body.nome}
        );

        if(!errors.isEmpty()){
            res.render('genero_form',{titulo: 'Criar Gênero', gen: gen, errors: errors.array(),botao:'Adicionar'});
            return;
        }
        else{
            genero.findOne({'nome': req.body.nome})
            .exec((err,found_genre)=>{
                if(err){
                    return next(err);
                }
                if(found_genre){
                    res.redirect(found_genre.url);
                }
                else{
                    gen.save((err)=>{
                        if(err){
                            return next(err);
                        }
                        res.redirect(gen.url);
                    });
                }
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res,next) {
    async.parallel({
        genero:(callback)=>{
            genero.findById(req.params.id)
            .exec(callback);
        },
        genero_livros:(callback)=>{
            livro.find({'genero':req.params.id})
            .exec(callback);
        },
    }, (err,results)=>{
        if(err){
            return next(err);
        }
        if(results.genero == null){
            res.redirect('/catalogo/lista_generos');
        }
        res.render('genero_delete',{title:'Apagar Gênero',genero:results.genero,genero_livros:results.genero_livros});
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res,next) {
    async.parallel({
        genero:(callback)=>{
            genero.findById(req.body.generoid).exec(callback)
        },
        genero_livros:(callback)=>{
            livro.find({'genero':req.body.generoid}).exec(callback)
        },
    },function (err,results){
        if(err){return next(err);}
        if(results.genero_livros.length > 0){
            res.render('genero_delete',{title:'Apagar Gênero',genero:results.genero,genero_livros:results.genero_livros});
            return;
        }else{
            genero.findByIdAndRemove(req.body.generoid,function deleteGenero(err){
                if(err){return next(err);}
                res.redirect('/catalogo/lista_generos')    
            });
        }
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    genero.findById(req.params.id, function(err, gen){
        if(err){return next(err);}
        if(gen == null){
            var erro = new Error('genero não encontrado');
            erro.status
        }
        
        res.render('genero_form',{titulo:'Atualizar Gênero',gen:gen, botao:'Atualizar'});
    });
};

// Handle Genre update on POST.
exports.genre_update_post = [
    body('nome','Nome do gênero é obrigatório!').trim().isLength({ min: 1 }).escape(),

    (req,res,next)=>{
        const errors = validationResult(req);

        var gen = new genero(
            {nome: req.body.nome,
            _id:req.params.id}
        );

        if(!errors.isEmpty()){
            res.render('genero_form',{titulo: 'Atualizar Gênero', gen: gen, errors: errors.array(), botao:'Atualizar'});
            return;
        }else{
            genero.findByIdAndUpdate(req.params.id,gen,{},function(err){
                if(err){
                    return next(err);
                }
                res.redirect('/catalogo/lista_generos');
            });
        }
    }
];
