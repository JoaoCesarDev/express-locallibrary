var livroInstance = require('../models/livroInstance');
var livro = require('../models/livro');
const {body,validationResult} = require('express-validator');
var async = require('async');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res,next) {
    livroInstance.find()
    .populate('livro')
    .exec((err,list_book_intances)=>{   
        if(err){
            return next(err);
        }
            res.render('listaLivroInstance',{title:'Lista de Instâncias de Livros',list_book_intances:list_book_intances});
    });
    
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res,next) {
    livroInstance.findById(req.params.id)
    .populate('livro')
    .exec((err,livroInstance)=>{
        if(err){return next(err);}
        if(livroInstance == null){
            var err = new Error('Cópia de Livro não encontrada');
            err.status = 404;
            return next(err);
        }
        res.render('bookinstance_detail',{title:'Cópia: '+ livroInstance.livro.titulo, livroInstance: livroInstance});
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res,next){
    livro.find({},'titulo')
    .exec(function (err, livros) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', {titulo: 'Criar Instância de Livro', livros: livros,botao:'Adicionar'});
    });
   
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('livro','Livro deve ser especificado').trim().isLength({min:1}).escape(),
    body('imprimir','Impressão deve ser especificada').trim().isLength({min:1}).escape(),
    body('status').escape(),
    body('devolucao','Data Inválida').optional({checkFalsy:true}).isISO8601().toDate(),

    (req, res,next)=>{
        const errors = validationResult(req);

        var LivroInstance  = new livroInstance({
            livro:req.body.livro,
            imprimir:req.body.imprimir,
            status: req.body.status,
            devolucao:req.body.devolucao
        });

        if(!errors.isEmpty()){
            livro.find({},'titulo')
            .exec((err,livros)=>{
                if(err){
                    return next(err);
                }
                res.render('bookinstance_form',{titulo:'Criar Instância de Livro',livros:livros, livro_selecionado:LivroInstance._id,errors:errors.array(),LivroInstance:LivroInstance});
            });
            return;
        }else{
            LivroInstance.save((err)=>{
                if(err){
                    return next(err);
                }
            res.redirect(LivroInstance.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res,next) {
    livroInstance.findById(req.params.id)
    .populate('livro')
    .exec((err,livroInstance)=>{
        if(err){return next(err);}
        if(livroInstance == null){
            res.redirect('/catalogo/livroinstances');
        }
        res.render('livroInstance_delete',{title:'Apagar Instância do Livro -'+ livroInstance.livro.titulo, livroInstance: livroInstance});
    })
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res,next) {
    livroInstance.findById(req.params.id)
    .populate('livro').exec((err)=>{
        if(err){
            return next(err);
        }else{
            livroInstance.findByIdAndRemove(req.body.livroInstanceid,function deletelivroInstance(err){
                if(err){return next(err);}
                res.redirect('/catalogo/livroinstances')  
            });
        }
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res,next) {
    async.parallel({
        LivroInstance: function(callback){
            livroInstance.findById(req.params.id)
            .populate('livro')
            .exec(callback)
        },
        livros: function(callback){
            livro.find(callback)
        },
    },function(err,results){
        if(err){return next(err);}
        if(results.LivroInstance == null){
            var err = new Error('Instância de livro não encontrada!');
            err.status = 404;
            return next(err);
        }
        res.render('bookinstance_form',{titulo:'Atualizar Instância de Livro',livros:results.livros,livro_selecionado:results.LivroInstance.livro._id, LivroInstance:results.LivroInstance,botao:'Atualizar'});
    });
 };

// Handle bookinstance update on POST.
exports.bookinstance_update_post =  [
    body('livro','Livro deve ser especificado').trim().isLength({min:1}).escape(),
    body('imprimir','Impressão deve ser especificada').trim().isLength({min:1}).escape(),
    body('status').escape(),
    body('devolucao','Data Inválida').optional({checkFalsy:true}).isISO8601().toDate(),

    (req, res,next)=>{
        const errors = validationResult(req);

        var LivroInstance  = new livroInstance({
            livro:req.body.livro,
            imprimir:req.body.imprimir,
            status: req.body.status,
            devolucao:req.body.devolucao,
            _id:req.params.id
        });

        if(!errors.isEmpty()){
            livro.find({},'titulo')
            .exec((err,livros)=>{
                if(err){
                    return next(err);
                }
                res.render('bookinstance_form',{titulo:'Atualizar Instância de Livro',livros:livros, livro_selecionado:LivroInstance.livro._id,errors:errors.array(),LivroInstance:LivroInstance});
            });
            return;
        }else{
            livroInstance.findByIdAndUpdate(req.params.id, LivroInstance,{},function (err){
                if(err){
                    return next(err);
                }
                res.redirect('/catalogo/livroinstances');
            });
        }
    }









];
