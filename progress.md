# Progress — Admin Invitation Edit

## Status: DONE

### Task: Add `update` action to admin invitation panel

**File changed:**
- `src/routes/admin/invitations/+page.server.ts`

**What was added:**
- `update` action — edits any invitation from admin panel
- Admin role check + rate limit (20 req/min)
- Accepts formData: `invitation_id`, `template_id`, `groom_name`, `groom_full_name`, `groom_parents`, `groom_instagram`, `groom_photo`, `bride_name`, `bride_full_name`, `bride_parents`, `bride_instagram`, `bride_photo`, `quote`, `quote_source`, `akad_date`, `akad_time`, `resepsi_date`, `resepsi_time`, `venue_name`, `venue_address`, `venue_map_url`, `love_story`, `bank_accounts`, `dress_code_colors`, `music_url`, `background_image`, `gallery_images`, `is_published`, `custom_content`
- File upload for `groom_photo`, `bride_photo`, `background_image` with magic bytes validation (JPG/PNG only)
- Uploads saved to `static/uploads/{user_id}/` with UUID filename
- Reuses `updateInvitation` from `$lib/server/invitations`
- Audit log: `invitation.update` with updatedFields metadata

### No other files changed.
