import { W as FILENAME, n as pop_element, r as push_element } from "../../../chunks/dev.js";
//#region src/routes/logout/+page.svelte
_page[FILENAME] = "src/routes/logout/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<form method="POST" action="/logout">`);
		push_element($$renderer, "form", 1, 0);
		$$renderer.push(`<button type="submit">`);
		push_element($$renderer, "button", 2, 1);
		$$renderer.push(`Logging out...</button>`);
		pop_element();
		$$renderer.push(`</form>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
