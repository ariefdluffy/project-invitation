import * as server from '../entries/pages/dashboard/create/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.oe47xtwA.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/Dmyu7CHB.js"];
export const stylesheets = ["_app/immutable/assets/15.CcLGQSZR.css"];
export const fonts = [];
