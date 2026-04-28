

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/invitations/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BfXdbPSK.js","_app/immutable/chunks/DdYSuJ8G.js","_app/immutable/chunks/3bfzTCuz.js"];
export const stylesheets = ["_app/immutable/assets/6.BKNrv2Rh.css"];
export const fonts = [];
