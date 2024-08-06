var pool = require('./bd');

// sirve para listar novedades
async function getNovedades() {
    var query = 'SELECT * FROM novedades ORDER BY id DESC'; // Ordenar por id en orden descendente
    var rows = await pool.query(query);
    return rows;
}

// sirve para eliminar novedades
async function deleteNovedadesById(id) {
    var query = 'DELETE FROM novedades WHERE id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

// función para agregar novedad
async function insertNovedad(obj) {
    try {
        var query = 'INSERT INTO novedades SET ?';
        var rows = await pool.query(query, [obj]);
        return rows;       
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// función que nos permitirá obtener una noticia única de la base de datos utilizando el id de la misma para seleccionarla
async function getNovedadById(id) {
    var query = 'SELECT * FROM novedades WHERE id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

// función para modificar novedad
async function modificarNovedadById(obj, id) {
    try {
        var query = 'UPDATE novedades SET ? WHERE id= ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;       
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// función para buscar novedades
async function buscarNovedades(busqueda) {
    try {
        // Verificar si `busqueda` es un número
        const isNumeric = !isNaN(parseInt(busqueda, 10));
        
        let query;
        let params;

        if (isNumeric) {
            // Si es un número, solo buscar por ID
            query = 'SELECT * FROM novedades WHERE id = ?';
            params = [busqueda];
        } else {
            // Si no es un número, buscar por texto en todos los campos
            query = `
                SELECT * 
                FROM novedades 
                WHERE titulo LIKE ? 
                   OR subtitulo LIKE ? 
                   OR cuerpo LIKE ?`;
            params = [
                '%' + busqueda + '%', 
                '%' + busqueda + '%', 
                '%' + busqueda + '%'
            ];
        }
        
        const rows = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error en la consulta de búsqueda:', error);
        throw error; // Opcionalmente, lanzar el error para que el llamador lo maneje
    }
}

module.exports = {
    getNovedades,
    deleteNovedadesById,
    insertNovedad,
    getNovedadById,
    modificarNovedadById,
    buscarNovedades
};
