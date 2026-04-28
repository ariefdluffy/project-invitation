import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.3BSErWZn.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js"];
export const stylesheets = ["_app/immutable/assets/12.DX9Q4Rlz.css"];
export const fonts = [];
