/* NOTA: models.js construye la DB y el modelo importando (quiz.js)
		sequelize.sync() construye la DB según define el modelo.*/

		var path = require('path');

		// Cargar Modelo ORM
		var Sequelize = require('sequelize');  //importamos la librería del ORM


		// Usar BBDD SQLite:
		//indicamos que tiene
		var sequelize = new Sequelize(null, null, null, 
				       {dialect: "sqlite", storage: "quiz.sqlite"}
				    );

		// Importar la definicion de la tabla Quiz en /models/quiz.js
		var Quiz = sequelize.import(path.join(__dirname,'quiz'));

		exports.Quiz = Quiz; // exportar definición de tabla Quiz

		// sequelize.sync() crea e inicializa tabla de preguntas en DB
		sequelize.sync().success(function() {
		  // success(..) ejecuta el manejador una vez creada la tabla
		  Quiz.count().success(function (count){
		    if(count === 0) {   // la tabla se inicializa solo si está vacía
		      Quiz.create({ pregunta: 'Capital de Italia',
		      	            respuesta: 'Roma'
		      	         })
		      .success(function(){console.log('Base de datos inicializada')});
		    };
		  });
		});
