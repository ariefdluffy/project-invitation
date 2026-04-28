import * as server from '../entries/pages/invitation/_slug_/_page.server.ts.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/invitation/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/invitation/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/19.CdJUdtyd.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/BeOXCcaa.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/Dlp_kUYC.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/19.CADjvG9A.css"];
export const fonts = [];
