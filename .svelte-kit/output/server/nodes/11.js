import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.D1vka2OF.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/3bfzTCuz.js"];
export const stylesheets = ["_app/immutable/assets/11.DX9Q4Rlz.css"];
export const fonts = [];
