var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var GeneroSchema = new Schema(
    {
        nome:{type:String,required:true,maxLength:100}
    }
);

// Virtual for bookinstance's URL
GeneroSchema
.virtual('url')
.get(function () {
    return '/catalogo/genero/' + this._id;
});

module.exports = mongoose.model('Genero',GeneroSchema);
