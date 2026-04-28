import * as server from '../entries/pages/demo/_id_/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/demo/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.Crp2bK1l.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/CPcWW8RF.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/Tema31InspiredWedding.CyAaQ0hg.css","_app/immutable/assets/20.iPGBOFEQ.css"];
export const fonts = [];
