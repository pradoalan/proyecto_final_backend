const socket = io();
const divProductos = document.getElementById('divProductos');

const clearFile = (type) => {
  const file = type === 'single' ? document.getElementById('archivo') : document.getElementById('archivos');
  file.value = "";
};

function agregarAlCarrito(codigoProducto) {
  console.log(codigoProducto);
}

//Renderizamos los productos
const renderProductos = (data) => {
  let html = `
              <br>
              {{#if productos }}
                  <div class="table-responsive">
                      <table class="table table-dark">
                          <tr class="text-warning">
                              <th class="font-weight-bold">Nombre</th>
                              <th class="font-weight-bold">Precio</th>
                              <th class="font-weight-bold">Foto</th>
                              <th></th>
                          </tr>
                          {{#each productos }}
                              <tr>
                                  <td> {{ nombre }}</td>
                                  <td> {{ precio }}</td>
                                  <td> <img src="{{ fotoUrl }}" alt="{{ nombre }}" width="100" height="100"> </td>
                                  <td><p align="center"><input id="btn{{ codigo }}" class="btn btn-warning" type="submit" id="agregar" value="Agregar al carrito" onclick="agregarAlCarrito('{{ codigo }}')"/></p></td>
                              </tr>
                          {{/each }}
                      </table>
                  </div>
              {{else }}
                  <h3 class="alert alert-warning">No se encontraron productos</h3>
              {{/if}}
  `;
  const template = Handlebars.compile(html);
  if (divProductos) {
    divProductos.innerHTML = template({ productos: data });
  }
};

//Actualiza productos
socket.on('actualiza-productos', (productos) => {
  renderProductos(productos);
});