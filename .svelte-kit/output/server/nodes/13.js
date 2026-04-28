import * as server from '../entries/pages/dashboard/billing/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/billing/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/billing/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.Dqti1eU6.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/13.DmI17K-M.css"];
export const fonts = [];
