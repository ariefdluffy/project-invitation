

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BDN-LoW3.js","_app/immutable/chunks/qtr2OIrF.js","_app/immutable/chunks/C74-XmIn.js"];
export const stylesheets = ["_app/immutable/assets/5.CfXAA6xG.css"];
export const fonts = [];
