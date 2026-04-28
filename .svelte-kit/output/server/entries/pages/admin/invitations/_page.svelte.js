import { H as attr, U as escape_html, W as FILENAME, c as head, i as attr_class, n as pop_element, r as push_element, s as ensure_array_like, u as stringify } from "../../../../chunks/dev.js";
//#region src/routes/admin/invitations/+page.svelte
_page[FILENAME] = "src/routes/admin/invitations/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("15bv2ej", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Undangan - Admin ${escape_html(data.appName)}</title>`);
			});
		});
		$$renderer.push(`<div class="dash-header">`);
		push_element($$renderer, "div", 8, 0);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 9, 1);
		$$renderer.push(`💌 Semua Undangan</h1>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="dash-card">`);
		push_element($$renderer, "div", 12, 0);
		$$renderer.push(`<table class="dash-table">`);
		push_element($$renderer, "table", 13, 1);
		$$renderer.push(`<thead>`);
		push_element($$renderer, "thead", 14, 2);
		$$renderer.push(`<tr>`);
		push_element($$renderer, "tr", 15, 3);
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 16, 4);
		$$renderer.push(`Mempelai</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 17, 4);
		$$renderer.push(`Slug</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 18, 4);
		$$renderer.push(`Status</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 19, 4);
		$$renderer.push(`Tanggal Acara</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 20, 4);
		$$renderer.push(`Aksi</th>`);
		pop_element();
		$$renderer.push(`</tr>`);
		pop_element();
		$$renderer.push(`</thead>`);
		pop_element();
		$$renderer.push(`<tbody>`);
		push_element($$renderer, "tbody", 23, 2);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(data.invitations);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let inv = each_array[$$index];
			$$renderer.push(`<tr>`);
			push_element($$renderer, "tr", 25, 4);
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 26, 5);
			$$renderer.push(`<strong>`);
			push_element($$renderer, "strong", 26, 9);
			$$renderer.push(`${escape_html(inv.bride_name)} &amp; ${escape_html(inv.groom_name)}</strong>`);
			pop_element();
			$$renderer.push(`</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 27, 5);
			$$renderer.push(`/${escape_html(inv.slug)}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 28, 5);
			$$renderer.push(`<span${attr_class(`badge ${stringify(inv.is_published ? "badge-success" : "badge-warning")}`)}>`);
			push_element($$renderer, "span", 28, 9);
			$$renderer.push(`${escape_html(inv.is_published ? "Published" : "Draft")}</span>`);
			pop_element();
			$$renderer.push(`</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 29, 5);
			$$renderer.push(`${escape_html(inv.akad_date ? new Date(inv.akad_date).toLocaleDateString("id-ID") : "-")}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 30, 5);
			$$renderer.push(`<div class="action-btns svelte-15bv2ej">`);
			push_element($$renderer, "div", 31, 6);
			$$renderer.push(`<a${attr("href", `/dashboard/invitations/${stringify(inv.id)}`)} class="btn btn-secondary btn-sm">`);
			push_element($$renderer, "a", 32, 7);
			$$renderer.push(`Edit</a>`);
			pop_element();
			$$renderer.push(` `);
			if (inv.is_published) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", `/invitation/${stringify(inv.slug)}`)} target="_blank" class="btn btn-secondary btn-sm">`);
				push_element($$renderer, "a", 34, 8);
				$$renderer.push(`View</a>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(`</td>`);
			pop_element();
			$$renderer.push(`</tr>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></tbody>`);
		pop_element();
		$$renderer.push(`</table>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
