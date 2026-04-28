import * as server from '../entries/pages/dashboard/invitations/_id_/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/invitations/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/invitations/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.Y1nBggM1.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/Dlp_kUYC.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/16.Pj86dtBJ.css"];
export const fonts = [];
