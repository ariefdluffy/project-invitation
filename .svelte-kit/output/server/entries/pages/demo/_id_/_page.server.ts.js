import { t as getDb } from "../../../../chunks/db.js";
import { m as getTemplates } from "../../../../chunks/invitations.js";
import { error } from "@sveltejs/kit";
//#region src/routes/demo/[id]/+page.server.ts
var load = async ({ params }) => {
	const [rows] = await (await getDb()).execute("SELECT * FROM templates WHERE id = ?", [params.id]);
	let templates = rows;
	const all = await getTemplates();
	if (templates.length === 0) {
		const found = all.find((t) => t.id === params.id);
		if (found) templates = [found];
	} else {
		const jsonTemplate = all.find((t) => t.id === params.id);
		if (jsonTemplate) {
			const current = templates[0];
			if (!Boolean(current?.defaultContent?.title)) templates[0] = {
				...current,
				...jsonTemplate,
				defaultContent: jsonTemplate.defaultContent
			};
		}
	}
	if (templates.length === 0) throw error(404, "Template not found");
	const namePairs = [
		{
			bride: "Laras",
			brideFull: "Larasati Putri, S.E",
			groom: "Bayu",
			groomFull: "Bayu Pamungkas, S.T"
		},
		{
			bride: "Maya",
			brideFull: "Maya Sartika, M.Pd",
			groom: "Rizky",
			groomFull: "Rizky Ramadhan, B.A"
		},
		{
			bride: "Dewi",
			brideFull: "Dewi Anggraeni, S.Kom",
			groom: "Aditya",
			groomFull: "Aditya Pratama, M.M"
		},
		{
			bride: "Anisa",
			brideFull: "Anisa Rahmawati, S.Ked",
			groom: "Gilang",
			groomFull: "Gilang Permana, S.H"
		},
		{
			bride: "Putri",
			brideFull: "Putri Handayani, S.Sos",
			groom: "Dimas",
			groomFull: "Dimas Setiawan, S.T"
		},
		{
			bride: "Indah",
			brideFull: "Indah Lestari, A.Md",
			groom: "Fajar",
			groomFull: "Fajar Hidayat, M.Si"
		},
		{
			bride: "Siti",
			brideFull: "Siti Aminah, S.Ag",
			groom: "Ahmad",
			groomFull: "Ahmad Fauzi, Lc"
		}
	];
	const randomPair = namePairs[Math.floor(Math.random() * namePairs.length)];
	const dummyInvitation = {
		bride_name: randomPair.bride,
		bride_full_name: randomPair.brideFull,
		bride_parents: `Putri dari Bpk. ${randomPair.bride} Senior & Ibu ${randomPair.bride} Senior`,
		bride_photo: "https://images.unsplash.com/photo-1546803076-2675b871c828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		groom_name: randomPair.groom,
		groom_full_name: randomPair.groomFull,
		groom_parents: `Putra dari Bpk. ${randomPair.groom} Senior & Ibu ${randomPair.groom} Senior`,
		groom_photo: "https://images.unsplash.com/photo-1550096141-7263640ae4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		akad_date: "2026-08-17",
		akad_time: "09:00 - Selesai",
		resepsi_date: "2026-08-17",
		resepsi_time: "11:00 - 15:00",
		venue_name: "Grand Ballroom Hotel Mulia",
		venue_address: "Jl. Asia Afrika No.1, Senayan, Jakarta Pusat",
		venue_map_url: "https://maps.app.goo.gl/dummy",
		quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.",
		quote_source: "QS. Ar-Rum: 21",
		love_story: "Pertemuan Pertama\nKami bertemu di sebuah perpustakaan kota saat sedang mengerjakan tugas akhir.\n\nMenjalin Hubungan\nSetelah satu tahun berteman, kami menyadari ada rasa yang lebih dari sekadar teman.\n\nLamaran\nDi hari ulang tahun Indri, Adi memberanikan diri untuk melamar di depan keluarga besar.",
		background_image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
		music_url: "https://server14.mp3quran.net/khalf/004.mp3",
		gallery_images: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622\nhttps://images.unsplash.com/photo-1519225495810-751bd131c90d\nhttps://images.unsplash.com/photo-1458007683879-47560d7e33c3",
		bank_accounts: JSON.stringify([{
			bank: "BCA",
			number: "1234567890",
			name: "Indriana Putri"
		}]),
		dress_code_colors: JSON.stringify([
			"#8B6914",
			"#D4A574",
			"#FDF6E3"
		]),
		respect_person: "Keluarga Besar Bpk. Ahmad\nKeluarga Besar Bpk. Bambang"
	};
	const template = templates[0];
	const defaultContent = template?.defaultContent || {};
	const normalizedInvitation = { ...dummyInvitation };
	const assignIfPresent = (key, targetKey) => {
		const value = defaultContent[key];
		if (value === void 0 || value === null || value === "") return;
		if (targetKey === "bank_accounts" || targetKey === "dress_code_colors") {
			normalizedInvitation[targetKey] = Array.isArray(value) ? JSON.stringify(value) : String(value);
			return;
		}
		normalizedInvitation[targetKey] = String(value);
	};
	assignIfPresent("groom_name", "groom_name");
	assignIfPresent("bride_name", "bride_name");
	assignIfPresent("groom_full_name", "groom_full_name");
	assignIfPresent("bride_full_name", "bride_full_name");
	assignIfPresent("groom_parents", "groom_parents");
	assignIfPresent("bride_parents", "bride_parents");
	assignIfPresent("groom_photo", "groom_photo");
	assignIfPresent("bride_photo", "bride_photo");
	assignIfPresent("quote", "quote");
	assignIfPresent("quote_source", "quote_source");
	assignIfPresent("akad_date", "akad_date");
	assignIfPresent("akad_time", "akad_time");
	assignIfPresent("resepsi_date", "resepsi_date");
	assignIfPresent("resepsi_time", "resepsi_time");
	assignIfPresent("venue_name", "venue_name");
	assignIfPresent("venue_address", "venue_address");
	assignIfPresent("venue_map_url", "venue_map_url");
	assignIfPresent("love_story", "love_story");
	assignIfPresent("music_url", "music_url");
	assignIfPresent("background_image", "background_image");
	assignIfPresent("gallery_images", "gallery_images");
	assignIfPresent("bank_accounts", "bank_accounts");
	assignIfPresent("dress_code_colors", "dress_code_colors");
	assignIfPresent("respect_person", "respect_person");
	assignIfPresent("child_name", "groom_name");
	assignIfPresent("parent_name", "bride_name");
	if (defaultContent.title) normalizedInvitation.custom_content = JSON.stringify({ title: String(defaultContent.title) });
	return {
		template,
		invitation: normalizedInvitation,
		wishes: [{
			guest_name: "Budi Santoso",
			message: "Selamat menempuh hidup baru ya Indri & Adi! Semoga samawa.",
			is_attending: "hadir",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}, {
			guest_name: "Siska Amelia",
			message: "Happy wedding! Maaf belum bisa hadir langsung.",
			is_attending: "tidak_hadir",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}],
		guestName: "Tamu Undangan"
	};
};
//#endregion
export { load };
