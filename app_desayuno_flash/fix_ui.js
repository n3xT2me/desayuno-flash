const fs = require('fs');

function injectSidebar(html) {
    const navRegex = /(<nav class="flex flex-col gap-\[18px\] text-brand-muted">[\s\S]*?)(<\/nav>)/;
    const injection = `
                    <!-- Cart -->
                    <a href="/cart" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition relative" title="Carrito">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <% if(locals.cart && cart.length > 0) { %>
                            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"><%= cart.length %></span>
                        <% } %>
                    </a>
                    <!-- Mis Pedidos -->
                    <% if(user) { %>
                    <a href="/mis-pedidos" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition" title="Mis Pedidos"><i class="fa-solid fa-box-open"></i></a>
                    <% } %>
    `;
    return html.replace(navRegex, `$1${injection}$2`);
}

['views/catalog.ejs', 'views/restaurant.ejs'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = injectSidebar(content);
    fs.writeFileSync(file, content);
});

// Update restaurant.ejs to add forms for adding to cart
let rest = fs.readFileSync('views/restaurant.ejs', 'utf8');
// The button is <a href="/checkout/<%= prod.id %>" class="flex items-center justify-center w-full bg-brand-accent text-white py-2 rounded-[8px] text-[11px] font-bold shadow-md shadow-brand-accent/30 hover:bg-green-700 transition gap-2">Pedir <i class="fa-solid fa-arrow-right"></i></a>
const btnRegex = /<a href="\/checkout\/<%= prod\.id %>" class="([^"]+)">([^<]+)<i([^>]+)><\/i><\/a>/g;
rest = rest.replace(btnRegex, `
                                <form action="/cart/add" method="POST" class="mt-auto w-full">
                                    <input type="hidden" name="product_id" value="<%= prod.id %>">
                                    <input type="hidden" name="name" value="<%= prod.name %>">
                                    <input type="hidden" name="price" value="<%= prod.price %>">
                                    <input type="hidden" name="image_url" value="<%= prod.image_url %>">
                                    <input type="hidden" name="restaurant_id" value="<%= prod.restaurant_id %>">
                                    <button type="submit" class="$1">Agregar al Carrito <i class="fa-solid fa-cart-plus ml-2"></i></button>
                                </form>
`);
fs.writeFileSync('views/restaurant.ejs', rest);

