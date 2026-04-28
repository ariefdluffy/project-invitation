import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, u as stringify } from "../../../../chunks/dev.js";
import "../../../../chunks/toast.svelte.js";
import "../../../../chunks/forms.js";
//#region src/routes/demo/[id]/+page.svelte
_page[FILENAME] = "src/routes/demo/[id]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const invitation = derived(() => data.invitation);
		const template = derived(() => data.template);
		derived(() => data.wishes);
		const guestName = derived(() => data.guestName);
		let isOpened = false;
		function fadeInAudio() {
			console.log("AudioRef not ready, retrying in 100ms...");
			setTimeout(fadeInAudio, 100);
		}
		derived(() => JSON.parse(invitation().bank_accounts || "[]"));
		derived(() => JSON.parse(invitation().dress_code_colors || "[]"));
		derived(() => (invitation().gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		const cssVars = derived(() => `
		--p-col: ${template().primary_color};
		--s-col: ${template().secondary_color};
		--a-col: ${template().accent_color};
		--f-fam: '${template().font_family}', serif;
	`);
		head("1ipe2ic", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>The Wedding of ${escape_html(invitation().bride_name)} &amp; ${escape_html(invitation().groom_name)}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Undangan Pernikahan ${stringify(invitation().bride_name)} & ${stringify(invitation().groom_name)}`)} class="svelte-1ipe2ic"/>`);
			push_element($$renderer, "meta", 197, 1);
			pop_element();
			$$renderer.push(` `);
			$$renderer.push(`<style class="svelte-1ipe2ic">
		@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap");

		body {
			background-color: var(--a-col) !important;
		}
	</style>`);
		});
		$$renderer.push(`<div${attr_class(`invitation-container template-${stringify(template().id)} layout-${stringify(template().layout_style)}`, "svelte-1ipe2ic")}${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 210, 0);
		$$renderer.push(`<div class="bg-blur-overlay svelte-1ipe2ic">`);
		push_element($$renderer, "div", 217, 1);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (invitation().music_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<audio loop="" preload="auto"${attr("src", invitation().music_url)} class="svelte-1ipe2ic">`);
			push_element($$renderer, "audio", 220, 2);
			$$renderer.push(`</audio>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("cover-section svelte-1ipe2ic", void 0, { "open": isOpened })}${attr_style("")}>`);
		push_element($$renderer, "div", 270, 1);
		$$renderer.push(`<div class="cover-content svelte-1ipe2ic">`);
		push_element($$renderer, "div", 277, 2);
		$$renderer.push(`<div class="cover-subtitle svelte-1ipe2ic">`);
		push_element($$renderer, "div", 278, 3);
		$$renderer.push(`THE WEDDING OF</div>`);
		pop_element();
		$$renderer.push(` <h1 class="cover-title svelte-1ipe2ic">`);
		push_element($$renderer, "h1", 279, 3);
		$$renderer.push(`${escape_html(invitation().bride_name)} <br class="svelte-1ipe2ic"/>`);
		push_element($$renderer, "br", 280, 28);
		pop_element();
		$$renderer.push(`&amp;<br class="svelte-1ipe2ic"/>`);
		push_element($$renderer, "br", 280, 35);
		pop_element();
		$$renderer.push(` ${escape_html(invitation().groom_name)}</h1>`);
		pop_element();
		$$renderer.push(` <div class="cover-date svelte-1ipe2ic">`);
		push_element($$renderer, "div", 283, 3);
		$$renderer.push(`${escape_html(invitation().akad_date ? new Date(invitation().akad_date).toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		}).replace(/\//g, " . ") : "")}</div>`);
		pop_element();
		$$renderer.push(` <div class="guest-info svelte-1ipe2ic">`);
		push_element($$renderer, "div", 295, 3);
		$$renderer.push(`<p class="svelte-1ipe2ic">`);
		push_element($$renderer, "p", 296, 4);
		$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
		pop_element();
		$$renderer.push(` <h3 class="svelte-1ipe2ic">`);
		push_element($$renderer, "h3", 297, 4);
		$$renderer.push(`${escape_html(guestName())}</h3>`);
		pop_element();
		$$renderer.push(` <span class="svelte-1ipe2ic">`);
		push_element($$renderer, "span", 298, 4);
		$$renderer.push(`*Mohon maaf bila ada kesalahan penulisan nama/gelar</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button class="btn-open svelte-1ipe2ic">`);
		push_element($$renderer, "button", 301, 3);
		$$renderer.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1ipe2ic">`);
		push_element($$renderer, "svg", 302, 4);
		$$renderer.push(`<path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" class="svelte-1ipe2ic">`);
		push_element($$renderer, "path", 309, 6);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`<path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0017 4H7a2 2 0 00-1.5 1.1z" class="svelte-1ipe2ic">`);
		push_element($$renderer, "path", 309, 59);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`</svg>`);
		pop_element();
		$$renderer.push(` Buka Undangan</button>`);
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
