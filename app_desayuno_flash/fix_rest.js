const fs = require('fs');
let rest = fs.readFileSync('views/restaurant.ejs', 'utf8');

const regex = /<a href="\/checkout\/<%= prod\.id %>" class="([^"]+)">([\s\S]*?)<\/a>/g;
rest = rest.replace(regex, `
                                            <form action="/cart/add" method="POST" class="inline-block">
                                                <input type="hidden" name="product_id" value="<%= prod.id %>">
                                                <input type="hidden" name="name" value="<%= prod.name %>">
                                                <input type="hidden" name="price" value="<%= prod.price %>">
                                                <input type="hidden" name="image_url" value="<%= prod.image_url %>">
                                                <input type="hidden" name="restaurant_id" value="<%= prod.restaurant_id %>">
                                                <button type="submit" class="$1">Agregar <i class="fa-solid fa-cart-plus ml-1"></i></button>
                                            </form>
`);
fs.writeFileSync('views/restaurant.ejs', rest);
