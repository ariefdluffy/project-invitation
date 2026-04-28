import * as server from '../entries/pages/dashboard/profile/_page.server.ts.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/19.CuHdH23Q.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/19.C_7Oz7b_.css"];
export const fonts = [];
