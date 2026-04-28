import * as server from '../entries/pages/dashboard/invitations/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DOYdMx5i.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/Dmxo6f7P.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/15.BNM0NLyp.css"];
export const fonts = [];
