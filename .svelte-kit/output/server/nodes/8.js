import * as server from '../entries/pages/admin/settings/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BSwet8-v.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/8.DHPonoCL.css"];
export const fonts = [];
