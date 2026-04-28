import * as server from '../entries/pages/dashboard/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.DJzPd513.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js"];
export const stylesheets = ["_app/immutable/assets/3.CEBSqcdC.css"];
export const fonts = [];
