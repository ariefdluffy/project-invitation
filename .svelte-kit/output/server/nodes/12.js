import * as server from '../entries/pages/dashboard/billing/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/billing/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/billing/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.bZkTbKEP.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/BeOXCcaa.js","_app/immutable/chunks/Dlp_kUYC.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/12.B0gXcIQT.css"];
export const fonts = [];
