import { H as attr, U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, u as stringify } from "./dev.js";
import "./toast.svelte.js";
import "./forms.js";
//#region src/lib/components/invitations/SimpleEventLayout.svelte
SimpleEventLayout[FILENAME] = "src/lib/components/invitations/SimpleEventLayout.svelte";
function SimpleEventLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const defaultLayout = {
			titleFallback: "Undangan",
			nameMode: "single",
			primaryNameKey: "groom_name",
			secondaryNameKey: "bride_name",
			aboutTitle: "Tentang Acara",
			aboutFallback: "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara ini.",
			eventTitle: "Detail Acara",
			primaryEventLabel: "Acara Utama",
			secondaryEventLabel: "Sesi Lanjutan",
			footerThanks: "Terima Kasih"
		};
		let { invitation, template, wishes = [], guestName = "", form, layout = defaultLayout } = $$props;
		let isOpened = false;
		const customContent = derived(() => {
			const raw = invitation?.custom_content;
			if (typeof raw === "object" && raw !== null) return raw;
			try {
				return JSON.parse(raw || "{}");
			} catch {
				return {};
			}
		});
		const templateTitle = derived(() => customContent()?.title || template?.defaultContent?.title || layout.titleFallback);
		const primaryName = derived(() => invitation?.[layout.primaryNameKey] || invitation?.groom_name || invitation?.bride_name || "");
		const secondaryName = derived(() => {
			if (!layout.secondaryNameKey) return "";
			return invitation?.[layout.secondaryNameKey] || "";
		});
		const showSecondaryName = derived(() => layout.nameMode !== "single" && Boolean(secondaryName()));
		derived(() => invitation?.love_story || invitation?.quote || layout.aboutFallback);
		derived(() => JSON.parse(invitation?.bank_accounts || "[]"));
		derived(() => (invitation?.gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		const primaryEventDate = derived(() => invitation?.akad_date || "");
		derived(() => invitation?.akad_time || "");
		const secondaryEventDate = derived(() => invitation?.resepsi_date || "");
		const secondaryEventTime = derived(() => invitation?.resepsi_time || "");
		derived(() => Boolean(secondaryEventDate() || secondaryEventTime()));
		const cssVars = derived(() => `
		--p-col: ${template?.primary_color || "#0f172a"};
		--s-col: ${template?.secondary_color || "#94a3b8"};
		--a-col: ${template?.accent_color || "#f8fafc"};
		--f-fam: '${template?.font_family || "Playfair Display"}', serif;
	`);
		function formatDate(dateStr) {
			if (!dateStr) return "";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		head("1mxh4qn", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(templateTitle())} ${escape_html(primaryName())}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Undangan ${stringify(templateTitle())} ${stringify(primaryName())}`)}/>`);
			push_element($$renderer, "meta", 172, 2);
			pop_element();
			$$renderer.push(` `);
			$$renderer.push(`<style>
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>`);
		});
		$$renderer.push(`<div class="event-layout svelte-1mxh4qn"${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 181, 0);
		$$renderer.push(`<div class="bg-overlay svelte-1mxh4qn">`);
		push_element($$renderer, "div", 187, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (invitation?.music_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<audio loop=""${attr("src", invitation.music_url)}>`);
			push_element($$renderer, "audio", 190, 4);
			$$renderer.push(`</audio>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("cover svelte-1mxh4qn", void 0, { "open": isOpened })}${attr_style("")}>`);
		push_element($$renderer, "div", 203, 2);
		$$renderer.push(`<div class="cover-card svelte-1mxh4qn">`);
		push_element($$renderer, "div", 210, 4);
		$$renderer.push(`<div class="cover-subtitle svelte-1mxh4qn">`);
		push_element($$renderer, "div", 211, 6);
		$$renderer.push(`${escape_html(templateTitle())}</div>`);
		pop_element();
		$$renderer.push(` <h1 class="cover-title svelte-1mxh4qn">`);
		push_element($$renderer, "h1", 212, 6);
		$$renderer.push(`${escape_html(primaryName())} `);
		if (showSecondaryName()) {
			$$renderer.push("<!--[0-->");
			if (layout.nameMode === "pair") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<br/>`);
				push_element($$renderer, "br", 216, 12);
				pop_element();
				$$renderer.push(`&amp;<br/>`);
				push_element($$renderer, "br", 216, 19);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<br/>`);
				push_element($$renderer, "br", 218, 12);
				pop_element();
			}
			$$renderer.push(`<!--]--> ${escape_html(secondaryName())}`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></h1>`);
		pop_element();
		$$renderer.push(` <div class="cover-date svelte-1mxh4qn">`);
		push_element($$renderer, "div", 223, 6);
		$$renderer.push(`${escape_html(formatDate(primaryEventDate()))}</div>`);
		pop_element();
		$$renderer.push(` <div class="guest-info svelte-1mxh4qn">`);
		push_element($$renderer, "div", 224, 6);
		$$renderer.push(`<p>`);
		push_element($$renderer, "p", 225, 8);
		$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
		pop_element();
		$$renderer.push(` <h3>`);
		push_element($$renderer, "h3", 226, 8);
		$$renderer.push(`${escape_html(guestName)}</h3>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button class="btn-open svelte-1mxh4qn">`);
		push_element($$renderer, "button", 228, 6);
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
	}, SimpleEventLayout);
}
SimpleEventLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/KhitanLayout.svelte
KhitanLayout[FILENAME] = "src/lib/components/invitations/KhitanLayout.svelte";
function KhitanLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Tasyakuran Khitanan",
				nameMode: "child-parent",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Khitanan",
				aboutFallback: "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran khitanan putra kami.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Prosesi Khitan",
				secondaryEventLabel: "Tasyakuran",
				footerThanks: "Terima Kasih"
			}
		});
	}, KhitanLayout);
}
KhitanLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/AqiqahLayout.svelte
AqiqahLayout[FILENAME] = "src/lib/components/invitations/AqiqahLayout.svelte";
function AqiqahLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Tasyakuran Aqiqah",
				nameMode: "child-parent",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Aqiqah",
				aboutFallback: "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran aqiqah putra/putri kami.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Aqiqah",
				secondaryEventLabel: "Tasyakuran",
				footerThanks: "Terima Kasih"
			}
		});
	}, AqiqahLayout);
}
AqiqahLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/BirthdayLayout.svelte
BirthdayLayout[FILENAME] = "src/lib/components/invitations/BirthdayLayout.svelte";
function BirthdayLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Birthday Party",
				nameMode: "single",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Acara",
				aboutFallback: "Dengan sukacita kami mengundang Anda untuk hadir di acara ulang tahun ini.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Perayaan",
				secondaryEventLabel: "Sesi Tambahan",
				footerThanks: "Terima Kasih"
			}
		});
	}, BirthdayLayout);
}
BirthdayLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/GatheringLayout.svelte
GatheringLayout[FILENAME] = "src/lib/components/invitations/GatheringLayout.svelte";
function GatheringLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Gathering",
				nameMode: "single",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Gathering",
				aboutFallback: "Kami mengundang Anda untuk hadir dan meramaikan acara gathering ini.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Acara Utama",
				secondaryEventLabel: "Sesi Lanjutan",
				footerThanks: "Terima Kasih"
			}
		});
	}, GatheringLayout);
}
GatheringLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/FormalLayout.svelte
FormalLayout[FILENAME] = "src/lib/components/invitations/FormalLayout.svelte";
function FormalLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Undangan Resmi",
				nameMode: "single",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Acara",
				aboutFallback: "Dengan hormat, kami mengundang Anda untuk menghadiri acara resmi ini.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Agenda Utama",
				secondaryEventLabel: "Sesi Tambahan",
				footerThanks: "Terima Kasih"
			}
		});
	}, FormalLayout);
}
FormalLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/GeneralLayout.svelte
GeneralLayout[FILENAME] = "src/lib/components/invitations/GeneralLayout.svelte";
function GeneralLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		SimpleEventLayout($$renderer, {
			invitation,
			template,
			wishes,
			guestName,
			form,
			layout: {
				titleFallback: "Undangan",
				nameMode: "single",
				primaryNameKey: "groom_name",
				secondaryNameKey: "bride_name",
				aboutTitle: "Tentang Acara",
				aboutFallback: "Kami mengundang Anda untuk menghadiri acara ini.",
				eventTitle: "Detail Acara",
				primaryEventLabel: "Acara Utama",
				secondaryEventLabel: "Sesi Lanjutan",
				footerThanks: "Terima Kasih"
			}
		});
	}, GeneralLayout);
}
GeneralLayout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/ThreeDMotionWedding.svelte
ThreeDMotionWedding[FILENAME] = "src/lib/components/invitations/ThreeDMotionWedding.svelte";
function ThreeDMotionWedding($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		let isOpened = false;
		const customContent = derived(() => {
			const raw = invitation?.custom_content;
			if (typeof raw === "object" && raw !== null) return raw;
			try {
				return JSON.parse(raw || "{}");
			} catch {
				return {};
			}
		});
		const titleText = derived(() => customContent()?.title || template?.defaultContent?.title || "The Wedding of");
		derived(() => JSON.parse(invitation?.bank_accounts || "[]"));
		derived(() => JSON.parse(invitation?.dress_code_colors || "[]"));
		derived(() => (invitation?.gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		const cssVars = derived(() => `
		--p-col: ${template?.primary_color || "#0ea5e9"};
		--s-col: ${template?.secondary_color || "#22c55e"};
		--a-col: ${template?.accent_color || "#020617"};
		--f-fam: '${template?.font_family || "Space Grotesk"}', sans-serif;
	`);
		function formatDate(dateStr) {
			if (!dateStr) return "";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		head("di7c15", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(titleText())} ${escape_html(invitation?.bride_name)} &amp; ${escape_html(invitation?.groom_name)}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Undangan ${stringify(titleText())} ${stringify(invitation?.bride_name)} & ${stringify(invitation?.groom_name)}`)} class="svelte-di7c15"/>`);
			push_element($$renderer, "meta", 109, 2);
			pop_element();
			$$renderer.push(` `);
			$$renderer.push(`<style class="svelte-di7c15">
    @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>`);
		});
		$$renderer.push(`<div class="motion-root svelte-di7c15"${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 121, 0);
		$$renderer.push(`<div class="neon-grid svelte-di7c15">`);
		push_element($$renderer, "div", 127, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="orb orb-one svelte-di7c15">`);
		push_element($$renderer, "div", 128, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="orb orb-two svelte-di7c15">`);
		push_element($$renderer, "div", 129, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="orb orb-three svelte-di7c15">`);
		push_element($$renderer, "div", 130, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (invitation?.music_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<audio loop=""${attr("src", invitation.music_url)} class="svelte-di7c15">`);
			push_element($$renderer, "audio", 133, 4);
			$$renderer.push(`</audio>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("cover svelte-di7c15", void 0, { "open": isOpened })}>`);
		push_element($$renderer, "div", 146, 2);
		$$renderer.push(`<div class="cover-card svelte-di7c15">`);
		push_element($$renderer, "div", 147, 4);
		$$renderer.push(`<p class="cover-eyebrow svelte-di7c15">`);
		push_element($$renderer, "p", 148, 6);
		$$renderer.push(`${escape_html(titleText())}</p>`);
		pop_element();
		$$renderer.push(` <h1 class="cover-title svelte-di7c15">`);
		push_element($$renderer, "h1", 149, 6);
		$$renderer.push(`${escape_html(invitation?.bride_name)}<span class="svelte-di7c15">`);
		push_element($$renderer, "span", 150, 32);
		$$renderer.push(`&amp;</span>`);
		pop_element();
		$$renderer.push(`${escape_html(invitation?.groom_name)}</h1>`);
		pop_element();
		$$renderer.push(` <p class="cover-date svelte-di7c15">`);
		push_element($$renderer, "p", 152, 6);
		$$renderer.push(`${escape_html(formatDate(invitation?.akad_date))}</p>`);
		pop_element();
		$$renderer.push(` <div class="guest-info svelte-di7c15">`);
		push_element($$renderer, "div", 153, 6);
		$$renderer.push(`<p class="svelte-di7c15">`);
		push_element($$renderer, "p", 154, 8);
		$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
		pop_element();
		$$renderer.push(` <h3 class="svelte-di7c15">`);
		push_element($$renderer, "h3", 155, 8);
		$$renderer.push(`${escape_html(guestName)}</h3>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button class="btn-open svelte-di7c15">`);
		push_element($$renderer, "button", 157, 6);
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
	}, ThreeDMotionWedding);
}
ThreeDMotionWedding.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/invitations/Tema31InspiredWedding.svelte
Tema31InspiredWedding[FILENAME] = "src/lib/components/invitations/Tema31InspiredWedding.svelte";
function Tema31InspiredWedding($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { invitation, template, wishes = [], guestName = "", form } = $$props;
		let isOpened = false;
		const customContent = derived(() => {
			const raw = invitation?.custom_content;
			if (typeof raw === "object" && raw !== null) return raw;
			try {
				return JSON.parse(raw || "{}");
			} catch {
				return {};
			}
		});
		const titleText = derived(() => customContent()?.title || template?.defaultContent?.title || "The Wedding of");
		derived(() => (invitation?.gallery_images || "").split(/[\n,]+/).map((u) => u.trim()).filter(Boolean));
		derived(() => JSON.parse(invitation?.bank_accounts || "[]"));
		const cssVars = derived(() => `
		--p-col: ${template?.primary_color || "#d4a574"};
		--s-col: ${template?.secondary_color || "#1f2937"};
		--a-col: ${template?.accent_color || "#fdf7ef"};
		--f-fam: '${template?.font_family || "Cormorant Garamond"}', serif;
	`);
		function formatDate(dateStr) {
			if (!dateStr) return "";
			return new Date(dateStr).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		head("er078a", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(titleText())} ${escape_html(invitation?.bride_name)} &amp; ${escape_html(invitation?.groom_name)}</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", `Undangan ${stringify(titleText())} ${stringify(invitation?.bride_name)} & ${stringify(invitation?.groom_name)}`)} class="svelte-er078a"/>`);
			push_element($$renderer, "meta", 107, 2);
			pop_element();
			$$renderer.push(` `);
			$$renderer.push(`<style class="svelte-er078a">
    @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Marcellus&display=swap");
    body {
      background-color: var(--a-col) !important;
    }
  </style>`);
		});
		$$renderer.push(`<div class="tema31 svelte-er078a"${attr_style(`${stringify(cssVars())} ${stringify("")}`)}>`);
		push_element($$renderer, "div", 119, 0);
		$$renderer.push(`<div class="grain svelte-er078a">`);
		push_element($$renderer, "div", 125, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="petal petal-one svelte-er078a">`);
		push_element($$renderer, "div", 126, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="petal petal-two svelte-er078a">`);
		push_element($$renderer, "div", 127, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="petal petal-three svelte-er078a">`);
		push_element($$renderer, "div", 128, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (invitation?.music_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<audio loop=""${attr("src", invitation.music_url)} class="svelte-er078a">`);
			push_element($$renderer, "audio", 131, 4);
			$$renderer.push(`</audio>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("cover svelte-er078a", void 0, { "open": isOpened })}>`);
		push_element($$renderer, "div", 144, 2);
		$$renderer.push(`<div class="cover-card svelte-er078a">`);
		push_element($$renderer, "div", 145, 4);
		$$renderer.push(`<p class="cover-subtitle svelte-er078a">`);
		push_element($$renderer, "p", 146, 6);
		$$renderer.push(`${escape_html(titleText())}</p>`);
		pop_element();
		$$renderer.push(` <h1 class="cover-title svelte-er078a">`);
		push_element($$renderer, "h1", 147, 6);
		$$renderer.push(`${escape_html(invitation?.bride_name)} <span class="svelte-er078a">`);
		push_element($$renderer, "span", 149, 8);
		$$renderer.push(`&amp;</span>`);
		pop_element();
		$$renderer.push(` ${escape_html(invitation?.groom_name)}</h1>`);
		pop_element();
		$$renderer.push(` <p class="cover-date svelte-er078a">`);
		push_element($$renderer, "p", 152, 6);
		$$renderer.push(`${escape_html(formatDate(invitation?.akad_date))}</p>`);
		pop_element();
		$$renderer.push(` <div class="guest-info svelte-er078a">`);
		push_element($$renderer, "div", 153, 6);
		$$renderer.push(`<p class="svelte-er078a">`);
		push_element($$renderer, "p", 154, 8);
		$$renderer.push(`Kepada Yth. Bapak/Ibu/Saudara/i</p>`);
		pop_element();
		$$renderer.push(` <h3 class="svelte-er078a">`);
		push_element($$renderer, "h3", 155, 8);
		$$renderer.push(`${escape_html(guestName)}</h3>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <button class="btn-open svelte-er078a">`);
		push_element($$renderer, "button", 157, 6);
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
	}, Tema31InspiredWedding);
}
Tema31InspiredWedding.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { GatheringLayout as a, KhitanLayout as c, FormalLayout as i, ThreeDMotionWedding as n, BirthdayLayout as o, GeneralLayout as r, AqiqahLayout as s, Tema31InspiredWedding as t };
