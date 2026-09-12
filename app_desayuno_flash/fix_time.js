const fs = require('fs');
let code = fs.readFileSync('views/checkout.ejs', 'utf8');

const regex = /<label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hora Programada de Entrega<\/label>[\s\S]*?<\/div>/;

const replacement = `<label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hora Programada de Entrega</label>
                                    <select name="scheduled_time" required class="w-full bg-[#F4F3FA] border-none rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-accent transition cursor-pointer appearance-none">
                                        <option value="" disabled selected>Selecciona un rango horario</option>
                                        <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM (Madrugador)</option>
                                        <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM (Clásico)</option>
                                        <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM (Oficina)</option>
                                        <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM (Tardío)</option>
                                    </select>
                                </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('views/checkout.ejs', code);
