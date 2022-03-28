const{DateTime} = require('luxon');
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        primeiro_nome:{type: String,required:true,maxLength:100},
        ultimo_nome:{type:String,required:true,maxLength:100},
        data_aniversario:{type:Date},
        data_morte:{type:Date}
    }
);

// Virtual for author's full name
AuthorSchema
.virtual('nome')
.get(function (){
    var nomeCompleto ='';
    if(this.primeiro_nome && this.ultimo_nome){
        nomeCompleto = this.ultimo_nome + ', ' + this.primeiro_nome
    }
    if(!this.primeiro_nome || !this.ultimo_nome){
        nomeCompleto = '';
    }
    return nomeCompleto;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
    var tempoDeVida_string ='';
    if(this.data_aniversario){
        tempoDeVida_string = this.Data_aniversario_formatada;
    }
    tempoDeVida_string += ' - ';
    if(this.data_morte){
        tempoDeVida_string += this.Data_morte_formatada;
    }
    return tempoDeVida_string;
});

AuthorSchema
.virtual('Data_aniversario_formatada')
.get(function () {
    return this.data_aniversario ? DateTime.fromJSDate(this.data_aniversario).toLocaleString(DateTime.DATE_MED): '';
});

AuthorSchema
.virtual('Data_morte_formatada')
.get(function () {
    return this.data_morte ? DateTime.fromJSDate(this.data_morte).toLocaleString(DateTime.DATE_MED): '';
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd')
.get(function() {
    return DateTime.fromJSDate(this.data_aniversario).toISODate(); //format 'YYYY-MM-DD'
});
  
AuthorSchema.virtual('date_of_death_yyyy_mm_dd')
.get(function() {
    return DateTime.fromJSDate(this.data_morte).toISODate(); //format 'YYYY-MM-DD'
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function (){
    return '/catalogo/autor/'+ this._id;
});

module.exports = mongoose.model('Autor',AuthorSchema);