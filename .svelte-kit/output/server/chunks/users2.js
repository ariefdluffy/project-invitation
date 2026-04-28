import { t as getDb } from "./db.js";
import { v4 } from "uuid";
import bcryptjs from "bcryptjs";
//#region src/lib/server/users.ts
async function createUser(username, email, password, role = "user") {
	const db = await getDb();
	const id = v4();
	const hashedPassword = bcryptjs.hashSync(password, 10);
	await db.execute("INSERT INTO users (id, username, email, password, role, has_access, payment_status, invitation_limit, guest_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		id,
		username,
		email,
		hashedPassword,
		role,
		0,
		"unpaid",
		1,
		50
	]);
	return {
		id,
		username,
		email,
		role,
		has_access: 0,
		payment_status: "unpaid",
		invitation_limit: 1,
		guest_limit: 50,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function authenticateUser(email, password) {
	const [rows] = await (await getDb()).execute("SELECT * FROM users WHERE email = ?", [email]);
	const userRows = rows;
	if (userRows.length > 0) {
		const row = userRows[0];
		if (bcryptjs.compareSync(password, row.password)) {
			const { password: _, ...user } = row;
			return user;
		}
	}
	return null;
}
async function getUserById(id) {
	const [rows] = await (await getDb()).execute("SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, created_at FROM users WHERE id = ?", [id]);
	const userRows = rows;
	if (userRows.length > 0) return userRows[0];
	return null;
}
async function getAllUsers() {
	const [rows] = await (await getDb()).execute("SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, created_at FROM users");
	return rows;
}
async function updateUserAccess(id, hasAccess, paymentStatus, invitationLimit, guestLimit) {
	const db = await getDb();
	const fields = ["has_access = ?"];
	const values = [hasAccess];
	if (paymentStatus !== void 0) {
		fields.push("payment_status = ?");
		values.push(paymentStatus);
	}
	if (invitationLimit !== void 0) {
		fields.push("invitation_limit = ?");
		values.push(invitationLimit);
	}
	if (guestLimit !== void 0) {
		fields.push("guest_limit = ?");
		values.push(guestLimit);
	}
	values.push(id);
	await db.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
}
async function deleteUser(id) {
	await (await getDb()).execute("DELETE FROM users WHERE id = ?", [id]);
}
async function addGuestLimitToUser(id, amount) {
	await (await getDb()).execute("UPDATE users SET guest_limit = guest_limit + ? WHERE id = ?", [amount, id]);
}
async function ensureGuestLimitColumn() {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'guest_limit'");
		if (rows.length === 0) {
			console.log("Adding guest_limit column to users table...");
			await db.execute("ALTER TABLE users ADD COLUMN guest_limit INT DEFAULT 50 AFTER invitation_limit");
		}
	} catch (err) {
		console.error("Migration Error (guest_limit):", err);
	}
}
//#endregion
export { ensureGuestLimitColumn as a, updateUserAccess as c, deleteUser as i, authenticateUser as n, getAllUsers as o, createUser as r, getUserById as s, addGuestLimitToUser as t };
