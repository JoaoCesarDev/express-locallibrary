var autor = require('../models/author');
var async = require('async');
var livro = require('../models/livro')
const {body,validationResult} = require('express-validator');
var debug = require('debug')('autor');

// Display list of all Authors.
exports.autor_List = (req,res,next)=>{
    autor.find()
    .sort([['ultimo_nome','ascending']])
    .exec((err,lista_autores)=>{
        if(err){
            return next(err);
        }
        res.render('lista_autores',{title:'Lista Autores',lista_autores:lista_autores});
    });
    
}

// Display detail page for a specific Author.
exports.autor_detalhes = (req,res,next)=>{
    async.parallel({
        autor:(callback)=>{
            autor.findById(req.params.id)
            .exec(callback)
        },
        livros_autores:(callback)=>{
            livro.find({'autor':req.params.id},'titulo resumo')
            .exec(callback)
        },
    }, (err,results)=>{
        if(err){
            return next(err);
        }
        if (results.autor == null){
            var err = new Error('Autor não encontrado');
            err.status = 404;
            return next(err);
        }
        res.render('autor_detalhes',{title:'Detalhes do Autor', autor:results.autor, livros_autores:results.livros_autores });
    });

}

// Display Author create form on GET.
exports.autor_create_get =function(req, res,next){
    res.render('autor_form',{titulo:'Criar Autor',botao:'Adicionar'});
}

// Handle Author create on POST.
exports.autor_create_post = [
    body('primeiro_nome').trim().isLength({min:1}).escape().withMessage('O primeiro nome deve ser especificado')
    .isAlphanumeric().withMessage('O Primeiro nome tem caracteres não alfanuméricos'),
    body('ultimo_nome').trim().isLength({min:1}).escape().withMessage('O último nome deve ser especificado')
    .isAlphanumeric().withMessage('O último nome tem caracteres não alfanuméricos'),
    body('data_aniversario','Data inválida para data de aniversário').optional({checkFalsy:true}).isISO8601().toDate(),
    body('data_morte','Data inválida para data de morte').optional({checkFalsy:true}).isISO8601().toDate(), 
    
    (req,res,next)=>{
        const erros = validationResult(req);

        if(!erros.isEmpty()){
            res.render('autor_form',{titulo:'Criar Autor',autor: req.body, errors:erros.array()});
            return
        }
        else{
            var author = new autor(
                {
                    primeiro_nome: req.body.primeiro_nome,
                    ultimo_nome: req.body.ultimo_nome,
                    data_aniversario: req.body.data_aniversario,
                    data_morte: req.body.data_morte
                }
            );
            author.save(function(err){
                if(err){
                  return next(err);
                }
                res.redirect(author.url);
            });
        }
    }
]

// Display Author delete form on GET.
exports.autor_delete_get = (req,res, next) => {
    async.parallel({
        autor: function(callback){
            autor.findById(req.params.id)
                .exec(callback)
        },
        autores_livros: function(callback){
            livro.find({ 'autor': req.params.id })
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.autor == null) {
            res.redirect('/catalogo/lista_autores');
        }
        res.render('autor_delete', { titulo: 'Delete Autor', autor: results.autor, autores_livros: results.autores_livros });
    });
}

// Handle Author delete on POST.
exports.autor_delete_post = (req,res,next) => {
    async.parallel({
        autor:function(callback){
            autor.findById(req.body.autorid).exec(callback)
        },
        autores_livros:function(callback){
            livro.find({'autor':req.body.autorid}).exec(callback)
        },
    }, function(err,results){
        if(err){return next(err);}
        if(results.autores_livros.length > 0){
            res.render('autor_delete',{titulo: 'Delete Autor', autor: results.autor, autores_livros: results.autores_livros });
            return;
        }else{
            autor.findByIdAndRemove(req.body.autorid,function deleteAutor(err){
                if(err){return next(err);}
                res.redirect('/catalogo/lista_autores')
            })
        }
    });
};

// Display Author update form on GET.
exports.autor_update_get = (req,res,next)=>{

        req.sanitize('id').escape().trim();
        autor.findById(req.params.id,function(err,autor){
            if(err){
                debug('update error:' + err);
                return next(err);
            }
            if(autor == null){
                var err = new Error('Autor não encontrado');
                err.status = 404;
            }
            res.render('autor_form',{titulo:'Atualizar Autor', autor:autor, botao:'Atualizar'});
        });

};

// Handle Author update on POST.
exports.autor_update_post = [
    body('primeiro_nome').trim().isLength({min:1}).escape().withMessage('O primeiro nome deve ser especificado')
    .isAlphanumeric().withMessage('O Primeiro nome tem caracteres não alfanuméricos'),
    body('ultimo_nome').trim().isLength({min:1}).escape().withMessage('O último nome deve ser especificado')
    .isAlphanumeric().withMessage('O último nome tem caracteres não alfanuméricos'),
    body('data_aniversario','Data inválida para data de aniversário').optional({checkFalsy:true}).isISO8601().toDate(),
    body('data_morte','Data inválida para data de morte').optional({checkFalsy:true}).isISO8601().toDate(), 
    
    (req,res,next)=>{
        const erros = validationResult(req);

        var author = new autor(
            {
                primeiro_nome: req.body.primeiro_nome,
                ultimo_nome: req.body.ultimo_nome,
                data_aniversario: req.body.data_aniversario,
                data_morte: req.body.data_morte,
                _id: req.params.id
            }
        );

        if(!erros.isEmpty()){
            res.render('autor_form',{titulo:'Atualizar Autor',autor: author, errors:erros.array()});
            return;
        }
        else{
            autor.findByIdAndUpdate(req.params.id,author,{},function(err){
                if(err){
                  return next(err);
                }
                res.redirect('/catalogo/lista_autores');
            });
        }
    }
];
