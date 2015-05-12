/**
 * Created by fabiolombardi on 10/05/15.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ToDoSchema   = new Schema({
    text: String
});

module.exports = mongoose.model('ToDo', ToDoSchema);