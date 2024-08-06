//testimonios.js es el controlador de testimoniosModel.js

var express = require('express');
var router = express.Router();
var testimoniosModel = require('../../models/testimoniosModel');



router.get('/', async function(req, res, next) {

     var testimonios = await testimoniosModel.getTestimonios();
   
  
    
     //imprime en el hbs estos datos
       res.render('admin/testimonios',{
         layout: 'admin/layout',
         persona: req.session.nombre,
         testimonios
       
       }); 
     });
     

    //elimina por el id
   router.get('/eliminar/:id', async (req, res, next) => {
  
      const id = req.params.id; 
      await testimoniosModel.deleteTestimoniosById(id);
      res.redirect('admin/testimonios')
       
       
       }); //cierra el get de eliminar






//visualizamos la vista de comerntario.hbs a traves del metodo get

router.get ('/comentario', (req, res, next) => {

  res.render('admin/comentario',{ //comentario.hbs dentro de carpeta admin
    layout: 'admin/layout'
  }); 
});



//insertar el comentario, se guarde en la base de datos y lo muestre en el listado

router.post ('/comentario',  async (req, res, next)=> {

  try{

    if(req.body.usuario != "" && req.body.comentario != "" && req.body.ubicacion != ""){
     
      await testimoniosModel.insertTestimonio (req.body); //req.body metodo para capturar datos
      res.redirect('/admin/testimonios')
  
  
    } else{
      res.render('admin/comentario',{ 
        layout: 'admin/layout',
        error: true, 
        message: 'Todos los campos son requeridos '
      })
    }
  
  }  catch (error){
    console.log(error)
    res.render('admin/comentario',{ 
      layout: 'admin/layout',
      error: true, 
      message: 'No se cargo el comentario '
  })
  
  }
});

     module.exports = router;