import * as server from '../entries/pages/admin/templates/preview/_id_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/templates/preview/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/templates/preview/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.TyN7l-ZR.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/CPcWW8RF.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/Tema31InspiredWedding.CyAaQ0hg.css","_app/immutable/assets/10.BfuR7GJs.css"];
export const fonts = [];
