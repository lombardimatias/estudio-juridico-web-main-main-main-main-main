var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');
var util = require(`util`);
var cloudinary = require(`cloudinary`).v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
const BASE_URL = 'https://res.cloudinary.com/dj5fhmfyc/video/upload/'; 


router.get('/', async function(req, res, next) {
  var novedades;
  if (req.query.q === undefined) {
    novedades = await novedadesModel.getNovedades();
  } else {
    novedades = await novedadesModel.buscarNovedades(req.query.q);
  }

  novedades = novedades.map(novedad => {
    let imagen = '';
    let video_url = '';

    if (novedad.img_id) {
        imagen = cloudinary.image(novedad.img_id, {
            width: 100,
            height: 100,
            crop: 'fill'
        });
    }

    if (novedad.video_url) {
        video_url = `<video height='100' width='100' controls autoplay muted preload='auto' poster='${cloudinary.url(novedad.video_url)}'>
                        <source src='${cloudinary.url(novedad.video_url, { format: 'webm' })}' type='video/webm'>
                        <source src='${cloudinary.url(novedad.video_url, { format: 'mp4' })}' type='video/mp4'>
                        <source src='${cloudinary.url(novedad.video_url, { format: 'ogv' })}' type='video/ogg'>
                     </video>`;
        
    }

    return {
        ...novedad,
        imagen,
        video_url
    };
});

  res.render('admin/novedades', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    novedades,
    is_search: req.query.q !== undefined,
    q: req.query.q
  });
});

  
  
  //para eliminar novedades
  
  router.get('/eliminar/:id', async (req, res, next) => {
  
   const id = req.params.id; //2

        let novedad = await novedadesModel.getNovedadById(id);
        if (novedad.img_id) {
          await(destroy(novedad.img_id));
        }


   await novedadesModel.deleteNovedadesById(id);
   res.redirect('/admin/novedades')
    
    
    }); //cierra el get de eliminar

//para agregar una novedad

router.get ('/agregar', (req, res, next) => {

  res.render('admin/agregar',{
    layout: 'admin/layout'
  }); 
});

//insertar la novedad, se guarde en la base de datos y lo muestre en el listado

// para agregar una novedad
router.post('/agregar', async (req, res, next) => {
  try {
    let img_id = '';
    let video_url = ''; // Cambiar de video_id a video_url

    if (req.files && Object.keys(req.files).length > 0) {
      if (req.files.imagen) {
        let imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
      }
      if (req.files.video) {
        let video = req.files.video;
        let uploadResult = await uploader(video.tempFilePath, { resource_type: 'video' });
        video_url = uploadResult.secure_url; // Obtener la URL completa del video
      }
    }

    if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
      await novedadesModel.insertNovedad({
        ...req.body,
        img_id,
        video_url // Cambiar de video_id a video_url
      });

      res.redirect('/admin/novedades');
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true, message: 'Todos los campos son requeridos'
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true, message: 'No se cargó la novedad'
    });
  }
});



/*creamos el controlador de ruta necesario para imprimir el formulario de modificación. Esta ruta tiene 
la particularidad, al igual que la de eliminar, de recibir como parámetro el id de la
novedad. Este id se utilizara para llamar a la función previamente creada y pasar la
novedad seleccionada al template*/

router.get ('/modificar/:id', async (req, res, next) => {

  let id = req.params.id;
  let novedad = await novedadesModel.getNovedadById (id);
  res.render('admin/modificar',{ 
    layout: 'admin/layout',
    novedad
  });
});


/*
En el archivo routes/admin/novedades.js creamos el controlador encargado de
recibir los datos del formulario y pasarlos a la función de model para efectuar la
modificación de la novedad en la base de datos.
En caso de éxito redirigimos al usuario al listado de novedades, de lo contrario
enviamos una variable de error y el mensaje describiendo el mismo

*/
router.post('/modificar', async (req, res, next) => {
  try {
    let img_id = req.body.img_original;
    let video_url = req.body.video_original;
    let borrar_img_vieja = false;
    let borrar_video_viejo = false;

    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && req.files.imagen) {
        let imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }

    if (req.body.video_delete === "1") {
      video_url = null;
      borrar_video_viejo = true;
    } else {
      if (req.files && req.files.video) {
        let video = req.files.video;
        video_url = (await uploader(video.tempFilePath, { resource_type: 'video' })).secure_url;
        borrar_video_viejo = true;
      }
    }

    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }

    if (borrar_video_viejo && req.body.video_original) {
      await destroy(req.body.video_original, { resource_type: 'video' });
    }

    let obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo,
      img_id,
      video_url
    };

    await novedadesModel.modificarNovedadById(obj, req.body.id);
    res.redirect('/admin/novedades');
  } catch (error) {
    console.log(error);
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modificó la novedad'
    });
  }
});


module.exports = router;
