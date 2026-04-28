import * as server from '../entries/pages/logout/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/logout/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.C8hByUc3.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js"];
export const stylesheets = [];
export const fonts = [];
