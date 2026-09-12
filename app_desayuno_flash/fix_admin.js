const fs = require('fs');
let code = fs.readFileSync('views/admin.ejs', 'utf8');

code = code.replace(
    /<select name="status"[\s\S]*?<\/select>/,
    `<select name="status" onchange="this.form.submit()" class="w-full text-xs font-bold bg-[#F2F1F8] border border-gray-200 rounded-lg p-2 outline-none text-[#555568] cursor-pointer hover:bg-gray-200 transition">
        <option value="Pendiente" <%= order.status === 'Pendiente' ? 'selected' : '' %>>Pendiente</option>
        <option value="Aprobado" <%= order.status === 'Aprobado' ? 'selected' : '' %>>Aprobado</option>
        <option value="Preparando" <%= order.status === 'Preparando' ? 'selected' : '' %>>Preparando</option>
        <option value="Listo" <%= order.status === 'Listo' ? 'selected' : '' %>>Listo</option>
        <option value="Repartidor Asignado" <%= order.status === 'Repartidor Asignado' ? 'selected' : '' %>>Repartidor Asignado</option>
        <option value="En Camino" <%= order.status === 'En Camino' ? 'selected' : '' %>>En Camino</option>
        <option value="Entregado" <%= order.status === 'Entregado' ? 'selected' : '' %>>Entregado</option>
    </select>`
);

fs.writeFileSync('views/admin.ejs', code);
