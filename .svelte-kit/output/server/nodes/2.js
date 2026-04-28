import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.C1lzVNpD.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js"];
export const stylesheets = ["_app/immutable/assets/2.Caaot7H-.css"];
export const fonts = [];
