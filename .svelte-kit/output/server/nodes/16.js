import * as server from '../entries/pages/dashboard/invitations/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.VoHgwqxb.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/Cpyhg-CH.js","_app/immutable/chunks/bU9V6r0z.js","_app/immutable/chunks/B1KZjUgi.js","_app/immutable/chunks/C74-XmIn.js","_app/immutable/chunks/BSxugrtE.js"];
export const stylesheets = ["_app/immutable/assets/16.BNM0NLyp.css"];
export const fonts = [];
