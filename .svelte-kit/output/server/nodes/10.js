import * as server from '../entries/pages/admin/users/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/users/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C7PAz3tY.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/BeOXCcaa.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/Dlp_kUYC.js","_app/immutable/chunks/3bfzTCuz.js"];
export const stylesheets = ["_app/immutable/assets/10.DE4YTaV-.css"];
export const fonts = [];
