import { p as getTemplateById } from "../../../../../../chunks/invitations.js";
import { error } from "@sveltejs/kit";
//#region src/routes/admin/templates/preview/[id]/+page.server.ts
var load = async ({ params }) => {
	const template = await getTemplateById(params.id);
	if (!template) throw error(404, "Template tidak ditemukan");
	return {
		template,
		invitation: {
			id: "preview",
			user_id: "admin",
			template_id: template.id,
			slug: "preview-template",
			groom_name: "Budi",
			groom_full_name: "Budi Santoso, S.T.",
			groom_parents: "Putra dari Bpk. Santoso & Ibu Ratna",
			groom_instagram: "@budisantoso",
			groom_photo: "https://images.unsplash.com/photo-1550096141-7263640ae4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
			bride_name: "Santi",
			bride_full_name: "Santi Rahayu, S.Pd.",
			bride_parents: "Putri dari Bpk. Ahmad & Ibu Siti",
			bride_instagram: "@santirahayu",
			bride_photo: "https://images.unsplash.com/photo-1546803076-2675b871c828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
			quote: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
			quote_source: "QS Ar-Rum : 21",
			akad_date: "2026-12-12",
			akad_time: "09:00 - 10:00 WIB",
			resepsi_date: "2026-12-12",
			resepsi_time: "11:00 - 13:00 WIB",
			venue_name: "Grand Ballroom Hotel Mulia",
			venue_address: "Jl. Asia Afrika, Senayan, Jakarta Pusat",
			venue_map_url: "https://goo.gl/maps/example",
			love_story: "Kami bertemu di bangku kuliah pada tahun 2018. Berawal dari tugas kelompok yang sama, kami mulai sering berdiskusi dan merasa cocok satu sama lain.\n\nSetelah 4 tahun menjalin hubungan, kami memutuskan untuk melangkah ke jenjang yang lebih serius yaitu pernikahan.",
			bank_accounts: JSON.stringify([{
				bank: "BCA",
				number: "1234567890",
				name: "Budi Santoso"
			}, {
				bank: "Mandiri",
				number: "0987654321",
				name: "Santi Rahayu"
			}]),
			dress_code_colors: JSON.stringify([
				"#FFFFFF",
				"#D4AF37",
				"#2C2C2C"
			]),
			music_url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
			background_image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
			gallery_images: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
			is_published: 1,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		},
		wishes: [{
			id: "1",
			guest_name: "Andi",
			message: "Selamat menempuh hidup baru ya Budi & Santi! Semoga sakinah mawaddah warahmah.",
			is_attending: "hadir",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}, {
			id: "2",
			guest_name: "Rina",
			message: "Happy wedding! Maaf tidak bisa hadir karena sedang di luar kota.",
			is_attending: "tidak_hadir",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}],
		guestName: "Tamu Undangan",
		appName: "Wedding.id"
	};
};
//#endregion
export { load };
