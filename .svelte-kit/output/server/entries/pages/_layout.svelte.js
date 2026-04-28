import { U as escape_html, W as FILENAME, c as head, i as attr_class, n as pop_element, r as push_element, s as ensure_array_like, u as stringify } from "../../chunks/dev.js";
import { t as toast } from "../../chunks/toast.svelte.js";
//#region src/lib/components/ToastContainer.svelte
ToastContainer[FILENAME] = "src/lib/components/ToastContainer.svelte";
function ToastContainer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="toast-container svelte-cqwvc2">`);
		push_element($$renderer, "div", 7, 0);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(toast.toasts);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			$$renderer.push(`<div${attr_class(`toast-card ${stringify(t.type)}`, "svelte-cqwvc2")}>`);
			push_element($$renderer, "div", 9, 2);
			$$renderer.push(`<div class="toast-icon svelte-cqwvc2">`);
			push_element($$renderer, "div", 13, 3);
			if (t.type === "success") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-cqwvc2">`);
				push_element($$renderer, "svg", 15, 5);
				$$renderer.push(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14">`);
				push_element($$renderer, "path", 15, 81);
				$$renderer.push(`</path>`);
				pop_element();
				$$renderer.push(`<polyline points="22 4 12 14.01 9 11.01">`);
				push_element($$renderer, "polyline", 15, 127);
				$$renderer.push(`</polyline>`);
				pop_element();
				$$renderer.push(`</svg>`);
				pop_element();
			} else if (t.type === "error") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-cqwvc2">`);
				push_element($$renderer, "svg", 17, 5);
				$$renderer.push(`<circle cx="12" cy="12" r="10">`);
				push_element($$renderer, "circle", 17, 81);
				$$renderer.push(`</circle>`);
				pop_element();
				$$renderer.push(`<line x1="15" y1="9" x2="9" y2="15">`);
				push_element($$renderer, "line", 17, 113);
				$$renderer.push(`</line>`);
				pop_element();
				$$renderer.push(`<line x1="9" y1="9" x2="15" y2="15">`);
				push_element($$renderer, "line", 17, 150);
				$$renderer.push(`</line>`);
				pop_element();
				$$renderer.push(`</svg>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-cqwvc2">`);
				push_element($$renderer, "svg", 19, 5);
				$$renderer.push(`<circle cx="12" cy="12" r="10">`);
				push_element($$renderer, "circle", 19, 81);
				$$renderer.push(`</circle>`);
				pop_element();
				$$renderer.push(`<line x1="12" y1="16" x2="12" y2="12">`);
				push_element($$renderer, "line", 19, 113);
				$$renderer.push(`</line>`);
				pop_element();
				$$renderer.push(`<line x1="12" y1="8" x2="12.01" y2="8">`);
				push_element($$renderer, "line", 19, 152);
				$$renderer.push(`</line>`);
				pop_element();
				$$renderer.push(`</svg>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div class="toast-message svelte-cqwvc2">`);
			push_element($$renderer, "div", 22, 3);
			$$renderer.push(`${escape_html(t.message)}</div>`);
			pop_element();
			$$renderer.push(` <button class="toast-close svelte-cqwvc2">`);
			push_element($$renderer, "button", 23, 3);
			$$renderer.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-cqwvc2">`);
			push_element($$renderer, "svg", 24, 4);
			$$renderer.push(`<line x1="18" y1="6" x2="6" y2="18">`);
			push_element($$renderer, "line", 24, 80);
			$$renderer.push(`</line>`);
			pop_element();
			$$renderer.push(`<line x1="6" y1="6" x2="18" y2="18">`);
			push_element($$renderer, "line", 24, 117);
			$$renderer.push(`</line>`);
			pop_element();
			$$renderer.push(`</svg>`);
			pop_element();
			$$renderer.push(`</button>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
	}, ToastContainer);
}
ToastContainer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/routes/+layout.svelte
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.push(`<meta name="viewport" content="width=device-width, initial-scale=1"/>`);
			push_element($$renderer, "meta", 8, 1);
			pop_element();
			$$renderer.push(` <meta name="theme-color" content="#1a1a2e"/>`);
			push_element($$renderer, "meta", 9, 1);
			pop_element();
			$$renderer.push(` <link rel="icon" type="image/png" href="/favicon.png"/>`);
			push_element($$renderer, "link", 10, 1);
			pop_element();
		});
		children($$renderer);
		$$renderer.push(`<!----> `);
		ToastContainer($$renderer, {});
		$$renderer.push(`<!---->`);
	}, _layout);
}
_layout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _layout as default };
