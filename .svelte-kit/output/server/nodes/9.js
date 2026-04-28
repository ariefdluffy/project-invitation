import * as server from '../entries/pages/admin/templates/preview/_id_/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/templates/preview/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/templates/preview/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.BqPQH1SF.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/3bfzTCuz.js","_app/immutable/chunks/hrCorHcK.js"];
export const stylesheets = ["_app/immutable/assets/9.17WVyeAT.css"];
export const fonts = [];
