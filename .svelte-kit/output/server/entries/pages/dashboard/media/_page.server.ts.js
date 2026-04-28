import { fail } from "@sveltejs/kit";
import fs from "fs";
import path from "path";
//#region src/routes/dashboard/media/+page.server.ts
var load = async ({ locals }) => {
	const userDir = path.join(process.cwd(), "static", "uploads", locals.user.id);
	let files = [];
	if (fs.existsSync(userDir)) files = fs.readdirSync(userDir).map((name) => {
		const stat = fs.statSync(path.join(userDir, name));
		return {
			name,
			url: `/uploads/${locals.user.id}/${name}`,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	}).sort((a, b) => b.mtimeMs - a.mtimeMs);
	return { files };
};
var actions = {
	upload: async ({ request, locals }) => {
		const file = (await request.formData()).get("file");
		if (!file || file.size === 0) return fail(400, { error: "Tidak ada file yang dipilih" });
		if (!["image/jpeg", "image/png"].includes(file.type)) return fail(400, { error: "Hanya file JPG dan PNG yang diperbolehkan" });
		const userDir = path.join(process.cwd(), "static", "uploads", locals.user.id);
		if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
		const ext = path.extname(file.name);
		const finalName = `${path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${Date.now()}${ext}`;
		const filePath = path.join(userDir, finalName);
		try {
			const buffer = Buffer.from(await file.arrayBuffer());
			fs.writeFileSync(filePath, buffer);
			return {
				success: true,
				message: "Foto berhasil diupload"
			};
		} catch (err) {
			console.error(err);
			return fail(500, { error: "Gagal menyimpan file" });
		}
	},
	delete: async ({ request, locals }) => {
		const fileName = (await request.formData()).get("fileName");
		if (!fileName) return fail(400, { error: "Nama file tidak valid" });
		const filePath = path.join(process.cwd(), "static", "uploads", locals.user.id, fileName);
		try {
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			return {
				success: true,
				message: "Foto berhasil dihapus"
			};
		} catch (err) {
			console.error("[Delete Error]:", err);
			return fail(500, { error: "Gagal menghapus file server: " + err.message });
		}
	}
};
//#endregion
export { actions, load };
