import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DT2WE1u2.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/3bfzTCuz.js"];
export const stylesheets = ["_app/immutable/assets/2.BAZHIV3m.css"];
export const fonts = [];
