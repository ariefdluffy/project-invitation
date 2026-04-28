import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, u as stringify } from "../../../../chunks/dev.js";
import "../../../../chunks/toast.svelte.js";
import "../../../../chunks/forms.js";
import { a as GatheringLayout, c as KhitanLayout, i as FormalLayout, n as ThreeDMotionWedding, o as BirthdayLayout, r as GeneralLayout, s as AqiqahLayout, t as Tema31InspiredWedding } from "../../../../chunks/Tema31InspiredWedding.js";
//#region src/routes/invitation/[slug]/+page.svelte
_page[FILENAME] = "src/routes/invitation/[slug]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const invitation = derived(() => data.invitation || {});
		const template = derived(() => data.template || {});
		const wishes = derived(() => data.wishes || []);
		const guestName = derived(() => data.guestName || "");
		const category = derived(() => (template()?.category || "wedding").toLowerCase());
		const isThreeDMotion = derived(() => template()?.id === "tmpl-3d-motion-wedding");
		const isTema31 = derived(() => template()?.id === "tmpl-tema-31-inspired");
		const isWedding = derived(() => category() === "wedding" || category() === "pernikahan" || category() === "anniversary");
		let isOpened = false;
		function fadeInAudio() {
			console.log("AudioRef not ready, retrying in 100ms...");
			setTimeout(fadeInAudio, 100);
		}
		derived(() => JSON.parse(invitation().bank_accounts || "[]"));
		derived(() => JSON.parse(invitation().dress_code_colors || "[]"));
		derived(() => (invitation().gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		let customContent = derived(() => {
			const raw = invitation().custom_content;
			if (typeof raw === "object" && raw !== null) return raw;
			try {
				return JSON.parse(raw || "{}");
			} catch (e) {
				return {};
			}
		});
		const templateTitle = derived(() => customContent().title || template()?.defaultContent?.title || "THE WEDDING OF");
		const cssVars = derived(() => `
		--p-col: ${template().primary_color};
		--s-col: ${template().secondary_color};
		--a-col: ${template().accent_color};
		--f-fam: '${template().font_family}', serif;
	`);
		head("u4xwva", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(templateTitle())} ${escape_html(invitation().bride_name)} &amp; ${escape_html(invitation().groom_name)}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Undangan ${stringify(templateTitle())} ${stringify(invitation().bride_name)} & ${stringify(invitation().groom_name)}`)} class="svelte-u4xwva"/>`);
			push_element($$renderer, "meta", 226, 1);
			pop_element();
			$$renderer.push(` `);
			$$renderer.push(`<style class="svelte-u4xwva">
		@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap");
	</style>`);
			$$renderer.push(` `);
			$$renderer.push(`<style class="svelte-u4xwva">
		body {
			background-color: var(--a-col) !important;
		}
	</style>`);
		});
		$$renderer.push(`<div${attr_class(`invitation-container template-${stringify(template().id)} layout-${stringify(template().layout_style)}`, "svelte-u4xwva")}${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 240, 0);
		if (template().background_type === "3d") $$renderer.push("<!--[0-->");
		else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="bg-blur-overlay svelte-u4xwva">`);
			push_element($$renderer, "div", 250, 1);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` `);
			if (invitation().music_url) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<audio loop="" preload="auto"${attr("src", invitation().music_url)} class="svelte-u4xwva">`);
				push_element($$renderer, "audio", 253, 2);
				$$renderer.push(`</audio>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (isTema31()) {
				$$renderer.push("<!--[0-->");
				Tema31InspiredWedding($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName(),
					form
				});
			} else if (isThreeDMotion()) {
				$$renderer.push("<!--[1-->");
				ThreeDMotionWedding($$renderer, {
					invitation: invitation(),
					template: template(),
					wishes: wishes(),
					guestName: guestName(),
					form
				});
			} else if (!isWedding()) {
				$$renderer.push("<!--[2-->");
				if (category() === "khitan") {
					$$renderer.push("<!--[0-->");
					KhitanLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				} else if (category() === "aqiqah") {
					$$renderer.push("<!--[1-->");
					AqiqahLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				} else if (category() === "birthday") {
					$$renderer.push("<!--[2-->");
					BirthdayLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				} else if (category() === "gathering") {
					$$renderer.push("<!--[3-->");
					GatheringLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				} else if (category() === "formal" || category() === "corporate") {
					$$renderer.push("<!--[4-->");
					FormalLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				} else {
					$$renderer.push("<!--[-1-->");
					GeneralLayout($$renderer, {
						invitation: invitation(),
						template: template(),
						wishes: wishes(),
						guestName: guestName(),
						form
					});
				}
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attr_class("cover-section svelte-u4xwva", void 0, { "open": isOpened })}${attr_style("")}>`);
				push_element($$renderer, "div", 322, 2);
				$$renderer.push(`<div class="cover-content svelte-u4xwva">`);
				push_element($$renderer, "div", 329, 3);
				$$renderer.push(`<div class="cover-subtitle svelte-u4xwva">`);
				push_element($$renderer, "div", 330, 4);
				$$renderer.push(`${escape_html(templateTitle())}</div>`);
				pop_element();
				$$renderer.push(` <h1 class="cover-title svelte-u4xwva">`);
				push_element($$renderer, "h1", 331, 4);
				$$renderer.push(`${escape_html(invitation().bride_name)} <br class="svelte-u4xwva"/>`);
				push_element($$renderer, "br", 332, 29);
				pop_element();
				$$renderer.push(`&amp;<br class="svelte-u4xwva"/>`);
				push_element($$renderer, "br", 332, 36);
				pop_element();
				$$renderer.push(` ${escape_html(invitation().groom_name)}</h1>`);
				pop_element();
				$$renderer.push(` <div class="cover-date svelte-u4xwva">`);
				push_element($$renderer, "div", 335, 4);
				$$renderer.push(`${escape_html(invitation().akad_date ? new Date(invitation().akad_date).toLocaleDateString("id-ID", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric"
				}).replace(/\//g, " . ") : "")}</div>`);
				pop_element();
				$$renderer.push(` <button class="btn-open svelte-u4xwva">`);
				push_element($$renderer, "button", 347, 4);
				$$renderer.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-u4xwva">`);
				push_element($$renderer, "svg", 348, 5);
				$$renderer.push(`<path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" class="svelte-u4xwva">`);
				push_element($$renderer, "path", 355, 7);
				$$renderer.push(`</path>`);
				pop_element();
				$$renderer.push(`<path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0017 4H7a2 2 0 00-1.5 1.1z" class="svelte-u4xwva">`);
				push_element($$renderer, "path", 355, 60);
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
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]-->`);
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
