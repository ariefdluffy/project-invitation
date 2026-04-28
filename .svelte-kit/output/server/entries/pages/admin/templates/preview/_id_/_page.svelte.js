import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, u as stringify } from "../../../../../../chunks/dev.js";
import "../../../../../../chunks/toast.svelte.js";
//#region src/routes/admin/templates/preview/[id]/+page.svelte
_page[FILENAME] = "src/routes/admin/templates/preview/[id]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const invitation = derived(() => data.invitation);
		const template = derived(() => data.template);
		derived(() => data.wishes);
		const guestName = derived(() => data.guestName);
		let isOpened = false;
		derived(() => JSON.parse(invitation().bank_accounts || "[]"));
		derived(() => JSON.parse(invitation().dress_code_colors || "[]"));
		derived(() => (invitation().gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		function formatDate(dateStr) {
			if (!dateStr) return "";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		const cssVars = derived(() => `
		--p-col: ${template().primary_color};
		--s-col: ${template().secondary_color};
		--a-col: ${template().accent_color};
		--f-fam: '${template().font_family}', serif;
	`);
		head("1xtb3wj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Preview Template: ${escape_html(template().name)}</title>`);
			});
			$$renderer.push(`<style>
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Cinzel:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Cinzel+Decorative:wght@400;700&family=Outfit:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Alex+Brush&display=swap');
		
		body {
			background-color: var(--a-col) !important;
		}
	</style>`);
		});
		$$renderer.push(`<div class="preview-mode-badge svelte-1xtb3wj">`);
		push_element($$renderer, "div", 103, 0);
		$$renderer.push(`PREVIEW MODE: ${escape_html(template().name)}</div>`);
		pop_element();
		$$renderer.push(` <a href="/admin/templates" class="back-to-admin svelte-1xtb3wj">`);
		push_element($$renderer, "a", 104, 0);
		$$renderer.push(`← Kembali ke Admin</a>`);
		pop_element();
		$$renderer.push(` <div class="invitation-container svelte-1xtb3wj"${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 106, 0);
		$$renderer.push(`<div class="bg-blur-overlay svelte-1xtb3wj">`);
		push_element($$renderer, "div", 107, 1);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (invitation().music_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<audio loop=""${attr("src", invitation().music_url)}>`);
			push_element($$renderer, "audio", 110, 2);
			$$renderer.push(`</audio>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("cover-section svelte-1xtb3wj", void 0, { "open": isOpened })}${attr_style("")}>`);
		push_element($$renderer, "div", 123, 1);
		$$renderer.push(`<div class="cover-content svelte-1xtb3wj">`);
		push_element($$renderer, "div", 124, 2);
		$$renderer.push(`<div class="cover-subtitle">`);
		push_element($$renderer, "div", 125, 3);
		$$renderer.push(`THE WEDDING OF</div>`);
		pop_element();
		$$renderer.push(` <h1 class="cover-title svelte-1xtb3wj">`);
		push_element($$renderer, "h1", 126, 3);
		$$renderer.push(`${escape_html(invitation().bride_name)} <br/>`);
		push_element($$renderer, "br", 126, 51);
		pop_element();
		$$renderer.push(`&amp;<br/>`);
		push_element($$renderer, "br", 126, 56);
		pop_element();
		$$renderer.push(` ${escape_html(invitation().groom_name)}</h1>`);
		pop_element();
		$$renderer.push(` <div class="cover-date">`);
		push_element($$renderer, "div", 127, 3);
		$$renderer.push(`${escape_html(formatDate(invitation().akad_date))}</div>`);
		pop_element();
		$$renderer.push(` <div class="guest-info">`);
		push_element($$renderer, "div", 129, 3);
		$$renderer.push(`<p>`);
		push_element($$renderer, "p", 130, 4);
		$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
		pop_element();
		$$renderer.push(` <h3>`);
		push_element($$renderer, "h3", 131, 4);
		$$renderer.push(`${escape_html(guestName())}</h3>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button class="btn-open svelte-1xtb3wj">`);
		push_element($$renderer, "button", 134, 3);
		$$renderer.push(`Buka Undangan</button>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
