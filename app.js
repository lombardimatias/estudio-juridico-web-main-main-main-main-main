var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');
const moment = require('moment');
const axios = require('axios'); // Para hacer solicitudes HTTP
require('moment/locale/es'); // Carga el idioma español
moment.locale('es'); // Configura Moment.js para usar español

// Usa Moment.js para formatear fechas
console.log(moment().format('LL')); // Muestra la fecha en formato largo en español

var multer = require('multer');
var upload = multer({ dest: 'uploads/' }); // configurar el almacenamiento de archivos




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });


//este proyecto va a requerir la dependencia 
//variables de entorno
require('dotenv').config();
var session = require('express-session');
var fileUpload = require(`express-fileupload`);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//rutas, este archivo se guarda en routes.

var biolinkRouter = require('./routes/biolink');
var nosotrosRouter = require('./routes/nosotros');
var novedadesRouter = require('./routes/novedades');
var serviciosRouter = require('./routes/servicios');
var formularioRouter = require('./routes/formulario');

var loginRouter = require('./routes/admin/login');
//crear admin.js login.js
var adminRouter = require('./routes/admin/novedades');


var testimoniosRouter = require('./routes/admin/testimonios');
//crear testimonios.js



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//envio de email

app.post('/send-email', upload.single('archivo'), async (req, res) => {
  var { nombre, apellido, tel, email, mensaje, tipo_consulta } = req.body;

  var archivo = req.file;



  var tipoConsultaMap = {
    '1': 'Nuestros servicios',
    '3': 'Ser parte del equipo',
    '5': 'Otro tipo de consulta'
  };
  var tipoConsultaTexto = tipoConsultaMap[tipo_consulta] || 'Consulta desconocida';

  var textoMensaje = `${nombre} ${apellido} se contactó a través del formulario web. Este es su correo: ${email}. Su teléfono es: ${tel}\n\n El objeto de la consulta fue: ${tipoConsultaTexto}\n\nAdemás, hizo el siguiente comentario: ${mensaje}.`;
  var archivo = req.file;




  var config = {
    host: `smtp.gmail.com`,
    port: 587,
    auth: {
      user: `danielosvaldoduda93@gmail.com`,
      pass: `xxmg gnob vcjy tfwt` // Asegúrate de tener una contraseña de aplicación configurada en tu cuenta de Gmail
    }
  };

  var transporter = nodemailer.createTransport(config);

  var mailOptions = {
    from: `danielosvaldoduda93@gmail.com`,
    to: `danielosvaldoduda93@gmail.com`,
    subject: `Mensaje de contacto desde la web`,
    text: textoMensaje,
    attachments: archivo ? [{ path: archivo.path }] : []

  };

  try {
    var info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.error(error);
    res.send('Hubo un error al enviar el mensaje');
  }
});

// Cierre de envio de email

//envío de whatsapp

app.post('/schedule', (req, res) => {
  const { name, email, date, reason, message } = req.body;

  // Aquí puedes procesar y guardar los datos en la base de datos o manejarlo como necesites

  console.log('Datos recibidos:', { name, email, date, reason, message });

  res.json({ success: true, message: 'Turno agendado exitosamente.' });
});

//cierre envío de whatsapp


//inicio sesion
app.use(session({

  secret: '12w45qelqe4qleq54eq5',
  resave: false,
  saveUninitialized: true

}));

secured = async (req, res, next) => {

  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    }
    else {
      res.redirect('/admin/login')
    }
  } catch (error) {
    console.log(error);
  }
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: `/tmp/`

}));
// Cierre inicio sesion









// los manejadores de rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/biolink', biolinkRouter);
app.use('/nosotros', nosotrosRouter);
app.use('/servicios', serviciosRouter);
app.use('/novedades', novedadesRouter);
app.use('/formulario', formularioRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured, adminRouter);
app.use('/admin/testimonios', testimoniosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
