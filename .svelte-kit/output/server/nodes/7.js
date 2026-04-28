import * as server from '../entries/pages/admin/settings/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/settings/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/settings/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.CZFc5ijh.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/BeOXCcaa.js","_app/immutable/chunks/Dlp_kUYC.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/7.DHPonoCL.css"];
export const fonts = [];
