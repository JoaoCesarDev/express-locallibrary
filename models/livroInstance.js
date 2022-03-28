const{DateTime} = require('luxon');
var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var LivroInstanceSchema = new Schema(
    {
        livro:{type:Schema.Types.ObjectId,ref:'Livro',required:true},
        imprimir:{type:String,required:true},
        status:{type:String,required:true,enum:['disponível','manutenção','emprestado','reservado'],default:'manutenção'},
        devolucao:{type:Date,default:Date.now}
    }
);

// Virtual for bookinstance's URL
LivroInstanceSchema
.virtual('url')
.get(function () {
    return '/catalogo/livroinstancia/' + this._id;
});

LivroInstanceSchema
.virtual('Data_Devolucao_formatada')
.get(function () {
    return DateTime.fromJSDate(this.devolucao).toLocaleString(DateTime.DATE_MED);
});
LivroInstanceSchema.virtual('Data_Devolucao_yyyy_mm_dd')
.get(function() {
    return DateTime.fromJSDate(this.devolucao).toISODate(); //format 'YYYY-MM-DD'
});

module.exports = mongoose.model('LivroInstancia',LivroInstanceSchema);