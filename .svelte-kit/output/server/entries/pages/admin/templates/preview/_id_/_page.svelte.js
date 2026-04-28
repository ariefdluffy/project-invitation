import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, u as stringify } from "../../../../../../chunks/dev.js";
import "../../../../../../chunks/toast.svelte.js";
import { a as GatheringLayout, c as KhitanLayout, i as FormalLayout, n as ThreeDMotionWedding, o as BirthdayLayout, r as GeneralLayout, s as AqiqahLayout, t as Tema31InspiredWedding } from "../../../../../../chunks/Tema31InspiredWedding.js";
//#region src/routes/admin/templates/preview/[id]/+page.svelte
_page[FILENAME] = "src/routes/admin/templates/preview/[id]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const invitation = derived(() => data.invitation);
		const template = derived(() => data.template);
		const wishes = derived(() => data.wishes);
		const guestName = derived(() => data.guestName);
		const templateTitle = derived(() => template()?.defaultContent?.title || "THE WEDDING OF");
		const category = derived(() => (template()?.category || "wedding").toLowerCase());
		const isThreeDMotion = derived(() => template()?.id === "tmpl-3d-motion-wedding");
		const isTema31 = derived(() => template()?.id === "tmpl-tema-31-inspired");
		const isWedding = derived(() => category() === "wedding" || category() === "pernikahan" || category() === "anniversary");
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
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Cinzel:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Cinzel+Decorative:wght@400;700&family=Outfit:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Alex+Brush&display=swap");

    body {
      background-color: var(--a-col) !important;
    }
  </style>`);
		});
		$$renderer.push(`<div class="preview-mode-badge svelte-1xtb3wj">`);
		push_element($$renderer, "div", 130, 0);
		$$renderer.push(`PREVIEW MODE: ${escape_html(template().name)}</div>`);
		pop_element();
		$$renderer.push(` <a href="/admin/templates" class="back-to-admin svelte-1xtb3wj">`);
		push_element($$renderer, "a", 131, 0);
		$$renderer.push(`← Kembali ke Admin</a>`);
		pop_element();
		$$renderer.push(` `);
		if (isTema31()) {
			$$renderer.push("<!--[0-->");
			Tema31InspiredWedding($$renderer, {
				invitation: invitation(),
				template: template(),
				wishes: wishes(),
				guestName: guestName()
			});
		} else if (isThreeDMotion()) {
			$$renderer.push("<!--[1-->");
			ThreeDMotionWedding($$renderer, {
				invitation: invitation(),
				template: template(),
				wishes: wishes(),
				guestName: guestName()
			});
		} else if (!isWedding()) {
			$$renderer.push("<!--[2-->");
			if (category() === "khitan") {
				$$renderer.push("<!--[0-->");
				KhitanLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			} else if (category() === "aqiqah") {
				$$renderer.push("<!--[1-->");
				AqiqahLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			} else if (category() === "birthday") {
				$$renderer.push("<!--[2-->");
				BirthdayLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			} else if (category() === "gathering") {
				$$renderer.push("<!--[3-->");
				GatheringLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			} else if (category() === "formal" || category() === "corporate") {
				$$renderer.push("<!--[4-->");
				FormalLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			} else {
				$$renderer.push("<!--[-1-->");
				GeneralLayout($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName()
				});
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="invitation-container"${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
			push_element($$renderer, "div", 152, 2);
			$$renderer.push(`<div class="bg-blur-overlay svelte-1xtb3wj">`);
			push_element($$renderer, "div", 158, 4);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` `);
			if (invitation().music_url) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<audio loop=""${attr("src", invitation().music_url)}>`);
				push_element($$renderer, "audio", 161, 6);
				$$renderer.push(`</audio>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div${attr_class("cover-section svelte-1xtb3wj", void 0, { "open": isOpened })}${attr_style("")}>`);
			push_element($$renderer, "div", 197, 4);
			$$renderer.push(`<div class="cover-content svelte-1xtb3wj">`);
			push_element($$renderer, "div", 204, 6);
			$$renderer.push(`<div class="cover-subtitle">`);
			push_element($$renderer, "div", 205, 8);
			$$renderer.push(`${escape_html(templateTitle())}</div>`);
			pop_element();
			$$renderer.push(` <h1 class="cover-title svelte-1xtb3wj">`);
			push_element($$renderer, "h1", 206, 8);
			$$renderer.push(`${escape_html(invitation().bride_name)} <br/>`);
			push_element($$renderer, "br", 207, 34);
			pop_element();
			$$renderer.push(`&amp;<br/>`);
			push_element($$renderer, "br", 207, 41);
			pop_element();
			$$renderer.push(` ${escape_html(invitation().groom_name)}</h1>`);
			pop_element();
			$$renderer.push(` <div class="cover-date">`);
			push_element($$renderer, "div", 210, 8);
			$$renderer.push(`${escape_html(formatDate(invitation().akad_date))}</div>`);
			pop_element();
			$$renderer.push(` <div class="guest-info">`);
			push_element($$renderer, "div", 212, 8);
			$$renderer.push(`<p>`);
			push_element($$renderer, "p", 213, 10);
			$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
			pop_element();
			$$renderer.push(` <h3>`);
			push_element($$renderer, "h3", 214, 10);
			$$renderer.push(`${escape_html(guestName())}</h3>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <button class="btn-open svelte-1xtb3wj">`);
			push_element($$renderer, "button", 217, 8);
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
		}
		$$renderer.push(`<!--]-->`);
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
