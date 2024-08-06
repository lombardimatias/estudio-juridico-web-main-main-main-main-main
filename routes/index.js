var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
var testimoniosModel = require('../models/testimoniosModel');

var cloudinary = require(`cloudinary`).v2;




router.get('/', async function(req, res, next) {
  var testimonios = await testimoniosModel.getTestimonios();
  res.render('index', { testimonios });
});



/* GET home page. */
router.get('/novedades', async function(req, res, next) {

  var novedades= await novedadesModel.getNovedades();
  var testimonios = await testimoniosModel.getTestimonios();

  
  novedades = novedades.map (novedad =>{

    if(novedad.img_id){
  
        const imagen = cloudinary.url (novedad.img_id, {
          
  
        });
        return {
          ...novedad,
          imagen
        }
    } else{
      return {
        ...novedad,
        imagen: ``
      }
    }
  
  });

res.render('novedades',{novedades,testimonios});
});



module.exports = router;
