var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LivroSchema = new Schema(
    {
        titulo:{type:String,required:true},
        autor:{type:Schema.Types.ObjectId,ref:'Autor',required:true},
        resumo:{type:String,required:true},
        isbn:{type:String,required:true},
        genero:[{type:Schema.Types.ObjectId,ref:'Genero'}]
    }
);

// Virtual for book's URL
LivroSchema
.virtual('url')
.get(function () {
    return '/catalogo/livro/' + this._id;
});

module.exports = mongoose.model('Livro',LivroSchema);