import * as server from '../entries/pages/dashboard/create/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.DSbw_PPB.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/Bg_ARNfz.js"];
export const stylesheets = ["_app/immutable/assets/14.CcLGQSZR.css"];
export const fonts = [];
