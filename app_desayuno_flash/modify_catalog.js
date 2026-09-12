const fs = require('fs');

let cat = fs.readFileSync('views/catalog.ejs', 'utf8');
cat = cat.replace(
    /<a href="\/login" class="btn btn-outline-light me-2">Ingresar<\/a>/,
    `<a href="/cart" class="btn btn-outline-light me-2">🛒 Carrito (<%= cart ? cart.length : 0 %>)</a>
     <a href="/login" class="btn btn-outline-light me-2">Ingresar</a>`
);
cat = cat.replace(
    /Bienvenido, <%= user.name %>!<\/span>/,
    `Bienvenido, <%= user.name %>!</span>
     <a href="/cart" class="btn btn-outline-light ms-3 me-2">🛒 Carrito (<%= cart ? cart.length : 0 %>)</a>
     <a href="/mis-pedidos" class="btn btn-outline-light me-2">Mis Pedidos</a>`
);
fs.writeFileSync('views/catalog.ejs', cat);

let rest = fs.readFileSync('views/restaurant.ejs', 'utf8');
rest = rest.replace(
    /<a href="\/checkout\/<%= product\.id %>" class="btn btn-success mt-auto">Pedir Ahora<\/a>/g,
    `<form action="/cart/add" method="POST" class="mt-auto d-flex">
        <input type="hidden" name="product_id" value="<%= product.id %>">
        <input type="hidden" name="name" value="<%= product.name %>">
        <input type="hidden" name="price" value="<%= product.price %>">
        <input type="hidden" name="image_url" value="<%= product.image_url %>">
        <input type="hidden" name="restaurant_id" value="<%= product.restaurant_id %>">
        <button type="submit" class="btn btn-success w-100">Agregar al Carrito</button>
     </form>`
);
// Also add cart header to restaurant.ejs
rest = rest.replace(
    /<\/nav>/,
    `<div class="d-flex">
        <a href="/cart" class="btn btn-outline-light me-2">🛒 Carrito (<%= cart ? cart.length : 0 %>)</a>
        <% if (user) { %><a href="/mis-pedidos" class="btn btn-outline-light me-2">Mis Pedidos</a><% } %>
    </div></nav>`
);
fs.writeFileSync('views/restaurant.ejs', rest);

let adm = fs.readFileSync('views/admin.ejs', 'utf8');
// Update the status options
adm = adm.replace(
    /<select name="status" class="form-select form-select-sm">[\s\S]*?<\/select>/g,
    `<select name="status" class="form-select form-select-sm">
        <option value="Pendiente" <%= order.status === 'Pendiente' ? 'selected' : '' %>>Pendiente</option>
        <option value="Aprobado" <%= order.status === 'Aprobado' ? 'selected' : '' %>>Aprobado</option>
        <option value="Preparando" <%= order.status === 'Preparando' ? 'selected' : '' %>>Preparando</option>
        <option value="Listo" <%= order.status === 'Listo' ? 'selected' : '' %>>Listo</option>
        <option value="Repartidor Asignado" <%= order.status === 'Repartidor Asignado' ? 'selected' : '' %>>Repartidor Asignado</option>
        <option value="En Camino" <%= order.status === 'En Camino' ? 'selected' : '' %>>En Camino</option>
        <option value="Entregado" <%= order.status === 'Entregado' ? 'selected' : '' %>>Entregado</option>
    </select>`
);
fs.writeFileSync('views/admin.ejs', adm);
