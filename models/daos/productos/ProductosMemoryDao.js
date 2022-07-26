const ContenedorMemory = require('../../contenedores/ContenedorMemory');

const arrayProductos = [
    {
        "nombre": "Televisor",
        "descripcion": "Televisor Pantalla Plana",
        "codigo": "P001",
        "fotoUrl": "https://st.depositphotos.com/1005574/4001/v/600/depositphotos_40012595-stock-illustration-tv-monitor.jpg",
        "precio": 49.999,
        "stock": 29,
        "timestamp": "2022-07-26T17:41:13.361Z",
        "id": 1
    },
    {
        "nombre": "Proyector",
        "descripcion": "Proyector multiuso",
        "codigo": "P002",
        "fotoUrl": "https://www.bidcom.com.ar/publicacionesML/productos/PROJ0060/1000x1000-PROJ0060.jpg",
        "precio": 17.999,
        "stock": 10,
        "timestamp": "2022-07-26T17:42:13.361Z",
        "id": 2
    },
    {
        "nombre": "Llanta",
        "descripcion": "Llanta aleacion Peugeot",
        "codigo": "P003",
        "fotoUrl": "https://http2.mlstatic.com/D_NQ_NP_735496-MLA44179533951_112020-O.jpg",
        "precio": 61.475,
        "stock": 4,
        "timestamp": "2022-07-26T17:43:13.361Z",
        "id": 3
    }
];

class ProductosMemoryDao extends ContenedorMemory {
    constructor() {
        super(arrayProductos);
    }
}

module.exports = ProductosMemoryDao;