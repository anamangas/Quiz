//Importamos ../models/models.js
var models = require ('../models/models.js');
// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
models.Quiz.find(quizId).then(
function(quiz) {
if (quiz) {
req.quiz = quiz;
next();
} else { next(new Error('No existe quizId=' + quizId)); }
}
).catch(function(error) { next(error);});
};

// GET /quizes
				exports.index = function(req, res) {
				  models.Quiz.findAll().then(
				    function(quizes) {
				      res.render('quizes/index', { quizes: quizes});
				    }
				  ).catch(function(error) { next(error);})
				};

				// GET /quizes/:id
				exports.show = function(req, res) {
				  res.render('quizes/show', { quiz: req.quiz});
				};

				// GET /quizes/:id/answer
				exports.answer = function(req, res) {
				  var resultado = 'Incorrecto';
				  if (req.query.respuesta === req.quiz.respuesta) {
				    resultado = 'Correcto';
				  }
				  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
				};

/ GET /quizes
//GET /quizes?search=texto_a_buscar
exports.index = function(req, res){
if(!req.query.search){ // GET /quizes
var condicion = {order : "pregunta ASC"};
models.Quiz.findAll(condicion).then(function(quizes){
res.render('quizes/index', {quizes: quizes});
}).catch(function(error) { next(error);})
}else{ //GET /quizes?search=texto_a_buscar
//Delimitamos el contenido antes y despues con %
var search = '%' + req.query.search + '%';
// Cambiamos los espacios por %
search = search.replace(' ', '%');
var condicion= { where : { pregunta: {
like: search
}} ,
order : 'pregunta'};
//var condicion = { where: ['pregunta LIKE ?', search],
// order : 'pregunta ASC'};
models.Quiz.findAll(condicion)
.then(function(quizes){
res.render('quizes/index', {quizes: quizes});
}).catch(function(error) { next(error);})
}
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  console.log ('export.create => ' + quiz);
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})  // res.redirect: Redirección HTTP a lista de preguntas
      }
    }
  );
