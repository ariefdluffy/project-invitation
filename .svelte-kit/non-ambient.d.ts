
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/invitations" | "/admin/profile" | "/admin/settings" | "/admin/templates" | "/admin/templates/preview" | "/admin/templates/preview/[id]" | "/admin/users" | "/api" | "/api/midtrans" | "/api/midtrans/create-transaction" | "/api/midtrans/notification" | "/dashboard" | "/dashboard/billing" | "/dashboard/billing/checkout" | "/dashboard/create" | "/dashboard/invitations" | "/dashboard/invitations/[id]" | "/dashboard/media" | "/dashboard/profile" | "/demo" | "/demo/[id]" | "/invitation" | "/invitation/[slug]" | "/login" | "/logout" | "/register" | "/uploads" | "/uploads/[...path]";
		RouteParams(): {
			"/admin/templates/preview/[id]": { id: string };
			"/dashboard/invitations/[id]": { id: string };
			"/demo/[id]": { id: string };
			"/invitation/[slug]": { slug: string };
			"/uploads/[...path]": { path: string }
		};
		LayoutParams(): {
			"/": { id?: string; slug?: string; path?: string };
			"/admin": { id?: string };
			"/admin/invitations": Record<string, never>;
			"/admin/profile": Record<string, never>;
			"/admin/settings": Record<string, never>;
			"/admin/templates": { id?: string };
			"/admin/templates/preview": { id?: string };
			"/admin/templates/preview/[id]": { id: string };
			"/admin/users": Record<string, never>;
			"/api": Record<string, never>;
			"/api/midtrans": Record<string, never>;
			"/api/midtrans/create-transaction": Record<string, never>;
			"/api/midtrans/notification": Record<string, never>;
			"/dashboard": { id?: string };
			"/dashboard/billing": Record<string, never>;
			"/dashboard/billing/checkout": Record<string, never>;
			"/dashboard/create": Record<string, never>;
			"/dashboard/invitations": { id?: string };
			"/dashboard/invitations/[id]": { id: string };
			"/dashboard/media": Record<string, never>;
			"/dashboard/profile": Record<string, never>;
			"/demo": { id?: string };
			"/demo/[id]": { id: string };
			"/invitation": { slug?: string };
			"/invitation/[slug]": { slug: string };
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/register": Record<string, never>;
			"/uploads": { path?: string };
			"/uploads/[...path]": { path: string }
		};
		Pathname(): "/" | "/admin" | "/admin/invitations" | "/admin/profile" | "/admin/settings" | "/admin/templates" | `/admin/templates/preview/${string}` & {} | "/admin/users" | "/api/midtrans/create-transaction" | "/api/midtrans/notification" | "/dashboard" | "/dashboard/billing" | "/dashboard/billing/checkout" | "/dashboard/create" | "/dashboard/invitations" | `/dashboard/invitations/${string}` & {} | "/dashboard/media" | "/dashboard/profile" | `/demo/${string}` & {} | `/invitation/${string}` & {} | "/login" | "/logout" | "/register" | `/uploads/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/qris_dummy.png" | "/robots.txt" | "/templates/aqiqah/aqiqah-soft.json" | "/templates/aqiqah/baby-blue.json" | "/templates/birthday/birthday-pop.json" | "/templates/formal/corporate-summit.json" | "/templates/gathering/arisan-keluarga.json" | "/templates/gathering/gathering-bistro.json" | "/templates/khitan/khitan-joy.json" | "/templates/pernikahan/3d-motion.json" | "/templates/pernikahan/anniversary-velvet.json" | "/templates/pernikahan/javanese-elegance.json" | "/templates/pernikahan/royal-midnight.json" | "/templates/pernikahan/tema-31-inspired.json" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07--1--1777084795947.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-07-1777084801661.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--1--1777084811542.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08--2--1777084830439.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-08-1777084840272.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-37-09-1777084818384.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-43-54-1777085568239.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-25-at-10-43-55-1777085562999.jpeg" | "/uploads/28d6f5a2-8033-474f-a185-4c64fe0c5f39/whatsapp-image-2026-04-26-at-20-07-49-1777205305404.jpeg" | "/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777085679984.jpeg" | "/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-bride_photo-1777205325642.jpeg" | "/uploads/33e01e0f-a672-4dc4-bc90-c53363b52723-groom_photo-1777085679985.jpeg" | "/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-background_image-1777046991096.jpg" | "/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-bride_photo-1777047022777.jpg" | "/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-gallery_images-1777046991099.jpg" | "/uploads/46c9a186-47e3-49f5-b9cb-fa8bdc25c1ab-groom_photo-1777047022778.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/486547023-1065802202248954-5082179717334344134-n-1777038976007.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/486609158-1065802175582290-5325662359838097259-n-1777039923203.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/678633183-3861485243982574-7258817377620287722-n-1777040867728.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/678924860-2736906306696415-5379513880898333742-n-1777040779330.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/679888091-3861484733982625-789921743050444292-n-1777040831714.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/channels4-profile-1777038547553.jpg" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/futuristic-armored-agent-in-flames-1777037523157.png" | "/uploads/9b787bdb-bc47-4ba6-b552-01a04f92e022/gemini-generated-image-avs2vgavs2vgavs2-1777037513459.png" | string & {};
	}
}