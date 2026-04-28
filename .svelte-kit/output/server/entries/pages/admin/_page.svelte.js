import { U as escape_html, W as FILENAME, a as attr_style, c as head, i as attr_class, n as pop_element, o as derived, r as push_element, s as ensure_array_like, u as stringify } from "../../../chunks/dev.js";
//#region src/routes/admin/+page.svelte
_page[FILENAME] = "src/routes/admin/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const stats = derived(() => [
			{
				label: "Total Users",
				value: data.users.length,
				icon: "👥",
				color: "#6c63ff"
			},
			{
				label: "Total Undangan",
				value: data.invitations.length,
				icon: "💌",
				color: "#a78bfa"
			},
			{
				label: "Published",
				value: data.invitations.filter((i) => i.is_published).length,
				icon: "✅",
				color: "#27ae60"
			},
			{
				label: "Template",
				value: data.templates.length,
				icon: "🎨",
				color: "#e67e22"
			}
		]);
		const paidUsers = derived(() => data.users.filter((u) => u.payment_status === "paid").length);
		const pendingUsers = derived(() => data.users.filter((u) => u.payment_status === "pending"));
		const pendingPreview = derived(() => pendingUsers().slice(0, 6));
		head("1jef3w8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Admin Dashboard - ${escape_html(data.appName)}</title>`);
			});
		});
		$$renderer.push(`<div class="dash-header">`);
		push_element($$renderer, "div", 25, 0);
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 26, 1);
		$$renderer.push(`📊 Admin Overview</h1>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="dash-stats">`);
		push_element($$renderer, "div", 29, 0);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(stats());
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let stat = each_array[i];
			$$renderer.push(`<div class="dash-stat"${attr_style(`animation: fadeInUp 0.5s ease ${stringify(i * .1)}s both`)}>`);
			push_element($$renderer, "div", 31, 2);
			$$renderer.push(`<h3>`);
			push_element($$renderer, "h3", 32, 3);
			$$renderer.push(`${escape_html(stat.icon)} ${escape_html(stat.label)}</h3>`);
			pop_element();
			$$renderer.push(` <div class="value">`);
			push_element($$renderer, "div", 33, 3);
			$$renderer.push(`${escape_html(stat.value)}</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(` <div class="dash-stats payment-overview svelte-1jef3w8">`);
		push_element($$renderer, "div", 38, 0);
		$$renderer.push(`<div class="dash-stat payment-stat payment-stat--paid svelte-1jef3w8">`);
		push_element($$renderer, "div", 39, 1);
		$$renderer.push(`<h3 class="svelte-1jef3w8">`);
		push_element($$renderer, "h3", 40, 2);
		$$renderer.push(`✅ Sudah bayar</h3>`);
		pop_element();
		$$renderer.push(` <div class="value">`);
		push_element($$renderer, "div", 41, 2);
		$$renderer.push(`${escape_html(paidUsers())}</div>`);
		pop_element();
		$$renderer.push(` <p class="stat-foot svelte-1jef3w8">`);
		push_element($$renderer, "p", 42, 2);
		$$renderer.push(`Aktivasi premium (paid)</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="dash-stat payment-stat payment-stat--pending svelte-1jef3w8">`);
		push_element($$renderer, "div", 44, 1);
		$$renderer.push(`<h3 class="svelte-1jef3w8">`);
		push_element($$renderer, "h3", 45, 2);
		$$renderer.push(`⏳ Proses pembayaran</h3>`);
		pop_element();
		$$renderer.push(` <div class="value">`);
		push_element($$renderer, "div", 46, 2);
		$$renderer.push(`${escape_html(pendingUsers().length)}</div>`);
		pop_element();
		$$renderer.push(` <p class="stat-foot svelte-1jef3w8">`);
		push_element($$renderer, "p", 47, 2);
		$$renderer.push(`Checkout / menunggu Midtrans</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (pendingPreview().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="dash-card pending-card svelte-1jef3w8">`);
			push_element($$renderer, "div", 52, 1);
			$$renderer.push(`<div class="card-header svelte-1jef3w8">`);
			push_element($$renderer, "div", 53, 2);
			$$renderer.push(`<h2 class="svelte-1jef3w8">`);
			push_element($$renderer, "h2", 54, 3);
			$$renderer.push(`Menunggu pembayaran</h2>`);
			pop_element();
			$$renderer.push(` <a href="/admin/users?filter=pending" class="btn btn-secondary btn-sm">`);
			push_element($$renderer, "a", 55, 3);
			$$renderer.push(`Kelola</a>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <table class="dash-table">`);
			push_element($$renderer, "table", 57, 2);
			$$renderer.push(`<thead>`);
			push_element($$renderer, "thead", 58, 3);
			$$renderer.push(`<tr>`);
			push_element($$renderer, "tr", 59, 4);
			$$renderer.push(`<th>`);
			push_element($$renderer, "th", 60, 5);
			$$renderer.push(`Username</th>`);
			pop_element();
			$$renderer.push(`<th>`);
			push_element($$renderer, "th", 61, 5);
			$$renderer.push(`Email</th>`);
			pop_element();
			$$renderer.push(`</tr>`);
			pop_element();
			$$renderer.push(`</thead>`);
			pop_element();
			$$renderer.push(`<tbody>`);
			push_element($$renderer, "tbody", 64, 3);
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(pendingPreview());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let u = each_array_1[$$index_1];
				$$renderer.push(`<tr>`);
				push_element($$renderer, "tr", 66, 5);
				$$renderer.push(`<td>`);
				push_element($$renderer, "td", 67, 6);
				$$renderer.push(`${escape_html(u.username)}</td>`);
				pop_element();
				$$renderer.push(`<td>`);
				push_element($$renderer, "td", 68, 6);
				$$renderer.push(`${escape_html(u.email)}</td>`);
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
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="overview-grid svelte-1jef3w8">`);
		push_element($$renderer, "div", 76, 0);
		$$renderer.push(`<div class="dash-card">`);
		push_element($$renderer, "div", 78, 1);
		$$renderer.push(`<div class="card-header svelte-1jef3w8">`);
		push_element($$renderer, "div", 79, 2);
		$$renderer.push(`<h2 class="svelte-1jef3w8">`);
		push_element($$renderer, "h2", 80, 3);
		$$renderer.push(`User Terbaru</h2>`);
		pop_element();
		$$renderer.push(` <div class="card-header-actions svelte-1jef3w8">`);
		push_element($$renderer, "div", 81, 3);
		$$renderer.push(`<a href="/admin/users?filter=payments" class="btn btn-secondary btn-sm">`);
		push_element($$renderer, "a", 82, 4);
		$$renderer.push(`Pembayaran</a>`);
		pop_element();
		$$renderer.push(` <a href="/admin/users" class="btn btn-secondary btn-sm">`);
		push_element($$renderer, "a", 83, 4);
		$$renderer.push(`Semua</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <table class="dash-table">`);
		push_element($$renderer, "table", 86, 2);
		$$renderer.push(`<thead>`);
		push_element($$renderer, "thead", 87, 3);
		$$renderer.push(`<tr>`);
		push_element($$renderer, "tr", 88, 4);
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 89, 5);
		$$renderer.push(`Username</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 90, 5);
		$$renderer.push(`Email</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 91, 5);
		$$renderer.push(`Role</th>`);
		pop_element();
		$$renderer.push(`</tr>`);
		pop_element();
		$$renderer.push(`</thead>`);
		pop_element();
		$$renderer.push(`<tbody>`);
		push_element($$renderer, "tbody", 94, 3);
		$$renderer.push(`<!--[-->`);
		const each_array_2 = ensure_array_like(data.users.slice(0, 5));
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let user = each_array_2[$$index_2];
			$$renderer.push(`<tr>`);
			push_element($$renderer, "tr", 96, 5);
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 97, 6);
			$$renderer.push(`${escape_html(user.username)}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 98, 6);
			$$renderer.push(`${escape_html(user.email)}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 99, 6);
			$$renderer.push(`<span${attr_class(`badge ${stringify(user.role === "admin" ? "badge-info" : "badge-success")}`)}>`);
			push_element($$renderer, "span", 99, 10);
			$$renderer.push(`${escape_html(user.role)}</span>`);
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
		$$renderer.push(` <div class="dash-card">`);
		push_element($$renderer, "div", 107, 1);
		$$renderer.push(`<div class="card-header svelte-1jef3w8">`);
		push_element($$renderer, "div", 108, 2);
		$$renderer.push(`<h2 class="svelte-1jef3w8">`);
		push_element($$renderer, "h2", 109, 3);
		$$renderer.push(`Undangan Terbaru</h2>`);
		pop_element();
		$$renderer.push(` <a href="/admin/invitations" class="btn btn-secondary btn-sm">`);
		push_element($$renderer, "a", 110, 3);
		$$renderer.push(`Lihat Semua</a>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <table class="dash-table">`);
		push_element($$renderer, "table", 112, 2);
		$$renderer.push(`<thead>`);
		push_element($$renderer, "thead", 113, 3);
		$$renderer.push(`<tr>`);
		push_element($$renderer, "tr", 114, 4);
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 115, 5);
		$$renderer.push(`Nama</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 116, 5);
		$$renderer.push(`Slug</th>`);
		pop_element();
		$$renderer.push(`<th>`);
		push_element($$renderer, "th", 117, 5);
		$$renderer.push(`Status</th>`);
		pop_element();
		$$renderer.push(`</tr>`);
		pop_element();
		$$renderer.push(`</thead>`);
		pop_element();
		$$renderer.push(`<tbody>`);
		push_element($$renderer, "tbody", 120, 3);
		$$renderer.push(`<!--[-->`);
		const each_array_3 = ensure_array_like(data.invitations.slice(0, 5));
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let inv = each_array_3[$$index_3];
			$$renderer.push(`<tr>`);
			push_element($$renderer, "tr", 122, 5);
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 123, 6);
			$$renderer.push(`${escape_html(inv.bride_name)} &amp; ${escape_html(inv.groom_name)}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 124, 6);
			$$renderer.push(`/${escape_html(inv.slug)}</td>`);
			pop_element();
			$$renderer.push(`<td>`);
			push_element($$renderer, "td", 125, 6);
			$$renderer.push(`<span${attr_class(`badge ${stringify(inv.is_published ? "badge-success" : "badge-warning")}`)}>`);
			push_element($$renderer, "span", 125, 10);
			$$renderer.push(`${escape_html(inv.is_published ? "Published" : "Draft")}</span>`);
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
		$$renderer.push(`</div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
export { _page as default };
