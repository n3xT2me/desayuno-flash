const fs = require('fs');
let code = fs.readFileSync('views/admin.ejs', 'utf8');

const regex = /<!-- Verificación de Pago -->[\s\S]*?<\/form>\s*<!-- Asignar Repartidor -->[\s\S]*?<\/form>\s*<!-- Estado Físico -->[\s\S]*?<\/form>/g;

const replacement = `
                                        <!-- Unified form for order updates -->
                                        <form action="/admin/pedido/<%= order.id %>/actualizar-todo" method="POST" class="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col gap-3">
                                            <div class="flex justify-between items-center">
                                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pago</span>
                                                <select name="payment_status" class="text-xs font-bold bg-white border outline-none cursor-pointer p-1 rounded <%= order.payment_status === 'Aprobado' ? 'text-green-600' : 'text-yellow-600' %>">
                                                    <option value="Pendiente" <%= order.payment_status === 'Pendiente' ? 'selected' : '' %>>Pendiente Validar</option>
                                                    <option value="Aprobado" <%= order.payment_status === 'Aprobado' ? 'selected' : '' %>>¡Pago Recibido!</option>
                                                </select>
                                            </div>
                                            
                                            <div class="flex justify-between items-center">
                                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider"><i class="fa-solid fa-motorcycle mr-1"></i> Repartidor</span>
                                                <select name="driver_name" class="text-xs font-bold bg-white border outline-none cursor-pointer text-blue-600 p-1 rounded max-w-[120px]">
                                                    <option value="">(Sin asignar)</option>
                                                    <% drivers.forEach(d => { %>
                                                        <option value="<%= d.name %>" <%= order.driver_name === d.name ? 'selected' : '' %>><%= d.name %></option>
                                                    <% }) %>
                                                </select>
                                            </div>

                                            <div class="pt-3 border-t border-gray-100">
                                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Estado del Pedido</span>
                                                <select name="status" class="w-full text-xs font-bold bg-white border border-gray-200 rounded p-2 outline-none text-[#555568] cursor-pointer hover:bg-gray-100 transition mb-2">
                                                    <option value="Pendiente" <%= order.status === 'Pendiente' ? 'selected' : '' %>>Pendiente</option>
                                                    <option value="Aprobado" <%= order.status === 'Aprobado' ? 'selected' : '' %>>Aprobado</option>
                                                    <option value="Preparando" <%= order.status === 'Preparando' ? 'selected' : '' %>>Preparando</option>
                                                    <option value="Listo" <%= order.status === 'Listo' ? 'selected' : '' %>>Listo</option>
                                                    <option value="Repartidor Asignado" <%= order.status === 'Repartidor Asignado' ? 'selected' : '' %>>Repartidor Asignado</option>
                                                    <option value="En Camino" <%= order.status === 'En Camino' ? 'selected' : '' %>>En Camino</option>
                                                    <option value="Entregado" <%= order.status === 'Entregado' ? 'selected' : '' %>>Entregado</option>
                                                </select>
                                                
                                                <button type="submit" class="w-full bg-[#16a34a] hover:bg-green-700 text-white font-bold py-2 rounded text-xs transition flex items-center justify-center gap-2 mt-2 shadow-md">
                                                    <i class="fa-solid fa-floppy-disk"></i> Guardar Cambios
                                                </button>
                                            </div>
                                        </form>
`;

code = code.replace(regex, replacement);
fs.writeFileSync('views/admin.ejs', code);
