import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, n as pop_element, r as push_element, s as ensure_array_like, u as stringify } from "../../../../chunks/dev.js";
import { n as getTemplateCategoryLabel } from "../../../../chunks/template-categories.js";
//#region src/routes/admin/templates/+page.svelte
_page[FILENAME] = "src/routes/admin/templates/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("15vd4s4", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Template - Admin ${escape_html(data.appName)}</title>`);
			});
		});
		$$renderer.push(`<div class="dash-header">`);
		push_element($$renderer, "div", 10, 0);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 11, 1);
		$$renderer.push(`🎨 Template</h1>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="template-grid svelte-15vd4s4">`);
		push_element($$renderer, "div", 14, 0);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(data.templates);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let template = each_array[$$index];
			$$renderer.push(`<div class="dash-card template-card svelte-15vd4s4">`);
			push_element($$renderer, "div", 16, 2);
			$$renderer.push(`<div class="template-preview svelte-15vd4s4"${attr_style(`background: linear-gradient(135deg, ${stringify(template.primary_color)}, ${stringify(template.secondary_color)})`)}>`);
			push_element($$renderer, "div", 17, 3);
			$$renderer.push(`<span${attr_style(`color: ${stringify(template.accent_color)}; font-family: ${stringify(template.font_family)}, serif; font-size: 1.4rem`)}>`);
			push_element($$renderer, "span", 18, 4);
			$$renderer.push(`${escape_html(template.name)}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="template-details svelte-15vd4s4">`);
			push_element($$renderer, "div", 20, 3);
			$$renderer.push(`<span class="template-cat svelte-15vd4s4">`);
			push_element($$renderer, "span", 21, 4);
			$$renderer.push(`${escape_html(getTemplateCategoryLabel(template.category))}</span>`);
			pop_element();
			$$renderer.push(` <h3 class="svelte-15vd4s4">`);
			push_element($$renderer, "h3", 22, 4);
			$$renderer.push(`${escape_html(template.name)}</h3>`);
			pop_element();
			$$renderer.push(` <p class="svelte-15vd4s4">`);
			push_element($$renderer, "p", 23, 4);
			$$renderer.push(`${escape_html(template.description)}</p>`);
			pop_element();
			$$renderer.push(` <div class="template-meta svelte-15vd4s4">`);
			push_element($$renderer, "div", 24, 4);
			$$renderer.push(`<span>`);
			push_element($$renderer, "span", 25, 5);
			$$renderer.push(`Layout: ${escape_html(template.layout_style)}</span>`);
			pop_element();
			$$renderer.push(` <span>`);
			push_element($$renderer, "span", 26, 5);
			$$renderer.push(`Font: ${escape_html(template.font_family)}</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="color-swatches svelte-15vd4s4">`);
			push_element($$renderer, "div", 28, 4);
			$$renderer.push(`<span class="swatch svelte-15vd4s4"${attr_style(`background: ${stringify(template.primary_color)}`)} title="Primary">`);
			push_element($$renderer, "span", 29, 5);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(` <span class="swatch svelte-15vd4s4"${attr_style(`background: ${stringify(template.secondary_color)}`)} title="Secondary">`);
			push_element($$renderer, "span", 30, 5);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(` <span class="swatch svelte-15vd4s4"${attr_style(`background: ${stringify(template.accent_color)}; border: 1px solid #555`)} title="Accent">`);
			push_element($$renderer, "span", 31, 5);
			$$renderer.push(`</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="template-actions" style="margin-top: 1.5rem;">`);
			push_element($$renderer, "div", 33, 4);
			$$renderer.push(`<a${attr("href", `/admin/templates/preview/${stringify(template.id)}`)} class="btn btn-secondary btn-sm w-full" style="text-align: center; display: block;">`);
			push_element($$renderer, "a", 34, 5);
			$$renderer.push(`👁️ Preview Halaman Tamu</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
