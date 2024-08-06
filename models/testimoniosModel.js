var pool = require ('./bd');



//sirve para listar testimonios
async function getTestimonios(){


    var query = 'select * from testimonios';
    var rows = await pool.query (query);
    return rows;

}


//sirve para eliminar testimonios
async function deleteTestimoniosById(id){

   var query = 'delete from testimonios where id = ?';
    var rows = await pool.query (query, [id]);
    return rows;
}

//sirve para agregar

async function insertTestimonio(obj) {
    try {
            var query = 'insert into testimonios set ?';
            var rows = await pool.query(query, [obj]);
            return rows;       
    }
    catch (error){
            console.log(error);
            throw (error);
    }
    

}







module.exports = { getTestimonios, deleteTestimoniosById, insertTestimonio}