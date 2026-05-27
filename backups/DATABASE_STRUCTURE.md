# Database Schema Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────┐
│      USERS              │
├─────────────────────────┤
│ id (PK)                 │
│ username (UNIQUE)       │
│ email (UNIQUE)          │
│ password                │
│ role (admin/user)       │
│ has_access              │
│ payment_status          │
│ invitation_limit        │
│ guest_limit             │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
         │
         │ 1:Many
         │
         ├─────────────────────────┐
         │                         │
         │                    ┌────────────────────┐
         │                    │    ORDERS          │
         │                    ├────────────────────┤
         │                    │ id (PK)            │
         │                    │ user_id (FK)       │
         │                    │ type               │
         │                    │ amount             │
         │                    │ status             │
         │                    │ payment_method     │
         │                    │ midtrans_tx_id     │
         │                    │ created_at         │
         │                    └────────────────────┘
         │
         └────────────────────────┐
                                  │
┌──────────────────────────────────────────────────┐
│         INVITATIONS                              │
├──────────────────────────────────────────────────┤
│ id (PK)                                          │
│ user_id (FK) ──┐                                │
│ template_id (FK) ────────────┐                 │
│ slug (UNIQUE)                │                  │
│ groom_name, groom_full_name  │                  │
│ groom_parents, groom_photo   │                  │
│ bride_name, bride_full_name  │                  │
│ bride_parents, bride_photo   │                  │
│ quote, quote_source          │                  │
│ akad_date, akad_time         │                  │
│ resepsi_date, resepsi_time   │                  │
│ venue_name, venue_address    │                  │
│ venue_map_url                │                  │
│ love_story                   │                  │
│ bank_accounts (JSON)         │                  │
│ dress_code_colors            │                  │
│ music_url                    │                  │
│ background_image             │                  │
│ gallery_images (JSON)        │                  │
│ is_published                 │                  │
│ view_count                   │                  │
│ created_at, updated_at       │                  │
└──────────────────────────────────────────────────┘
         │ 1:Many                │
         │                       │
    ┌────────────────┐    ┌──────────────────┐
    │     GUESTS     │    │   TEMPLATES      │
    ├────────────────┤    ├──────────────────┤
    │ id (PK)        │    │ id (PK)          │
    │ invitation_id  │    │ name             │
    │ name           │    │ slug (UNIQUE)    │
    │ slug           │    │ description      │
    │ is_attending   │    │ thumbnail        │
    │ num_guests     │    │ primary_color    │
    │ has_responded  │    │ secondary_color  │
    │ created_at     │    │ accent_color     │
    └────────────────┘    │ font_family      │
                          │ layout_style     │
    ┌────────────────┐    │ category         │
    │     WISHES     │    │ created_at       │
    ├────────────────┤    │ updated_at       │
    │ id (PK)        │    └──────────────────┘
    │ invitation_id  │
    │ guest_name     │
    │ message        │
    │ is_attending   │
    │ created_at     │
    └────────────────┘

┌──────────────────────────┐
│     SETTINGS             │
├──────────────────────────┤
│ key (PK, VARCHAR 100)    │
│ value (LONGTEXT)         │
│ updated_at               │
└──────────────────────────┘
```

---

## Data Flow

### User Registration & Payment Flow

```
1. User Register
   └─> Create user record in USERS table
       └─> payment_status = 'unpaid'
       └─> has_access = 0

2. User Initiates Payment
   └─> Create ORDER record
       └─> status = 'pending'
       └─> Update USERS.payment_status = 'pending'

3. Payment Success (Midtrans Webhook)
   └─> Update ORDER status = 'paid'
   └─> Update USERS
       └─> has_access = 1
       └─> payment_status = 'paid'
       └─> invitation_limit += 1

4. User Creates Invitation
   └─> Create INVITATIONS record
       └─> user_id = current_user.id
       └─> template_id = selected_template.id
       └─> is_published = 0 (draft)

5. User Adds Guests & Content
   └─> Create GUESTS records
   └─> Update INVITATIONS with content

6. User Publishes Invitation
   └─> Update INVITATIONS.is_published = 1
   └─> Generate shareable URL: /invitation/[slug]

7. Guest Opens Invitation
   └─> Update INVITATIONS.view_count += 1
   └─> Guest can RSVP & leave wishes

8. Guest RSVP & Wishes
   └─> Update GUESTS.has_responded = 1
   └─> Create WISHES record
```

---

## Table Indexes

### Performance Optimization

```sql
-- Users
INDEX idx_username (username)       -- For login
INDEX idx_email (email)             -- For email lookup
INDEX idx_created_at (created_at)   -- For listing

-- Templates
INDEX idx_category (category)       -- For template filtering
INDEX idx_slug (slug)               -- For URL lookup

-- Invitations
INDEX idx_user_id (user_id)         -- For user's invitations
INDEX idx_template_id (template_id) -- For template usage
INDEX idx_slug (slug)               -- For public URL
INDEX idx_is_published (is_published) -- For filtering
INDEX idx_created_at (created_at)   -- For chronological listing

-- Guests
INDEX idx_invitation_id (invitation_id) -- For guest listing
INDEX idx_has_responded (has_responded) -- For RSVP tracking
INDEX idx_created_at (created_at)       -- For listing

-- Wishes
INDEX idx_invitation_id (invitation_id) -- For wishes per invitation
INDEX idx_created_at (created_at)       -- For chronological order

-- Orders
INDEX idx_user_id (user_id)         -- For user's orders
INDEX idx_status (status)           -- For filtering
INDEX idx_created_at (created_at)   -- For listing
```

---

## Foreign Key Relationships

```
USERS (1) ──────┬─────> (Many) INVITATIONS
               │
               └─────> (Many) ORDERS

INVITATIONS (1) ──────┬─────> (Many) GUESTS
                     │
                     └─────> (Many) WISHES

TEMPLATES (1) ────────────────> (Many) INVITATIONS
```

---

## Sample Query Patterns

### Get User's Invitations with Template Info

```sql
SELECT 
    i.id,
    i.slug,
    i.groom_name,
    i.bride_name,
    i.is_published,
    i.view_count,
    t.name as template_name,
    COUNT(g.id) as guest_count
FROM invitations i
LEFT JOIN templates t ON i.template_id = t.id
LEFT JOIN guests g ON i.id = g.invitation_id
WHERE i.user_id = ?
GROUP BY i.id
ORDER BY i.created_at DESC;
```

### Get Invitation with All Details

```sql
SELECT 
    i.*,
    t.name as template_name,
    u.username as creator,
    COUNT(DISTINCT g.id) as total_guests,
    SUM(CASE WHEN g.has_responded = 1 THEN 1 ELSE 0 END) as rsvp_count
FROM invitations i
LEFT JOIN templates t ON i.template_id = t.id
LEFT JOIN users u ON i.user_id = u.id
LEFT JOIN guests g ON i.id = g.invitation_id
WHERE i.slug = ?
GROUP BY i.id;
```

### Get Guest RSVP Summary

```sql
SELECT 
    SUM(CASE WHEN has_responded = 1 AND is_attending = 1 THEN num_guests ELSE 0 END) as attending,
    SUM(CASE WHEN has_responded = 1 AND is_attending = 0 THEN num_guests ELSE 0 END) as not_attending,
    COUNT(CASE WHEN has_responded = 0 THEN 1 END) as no_response
FROM guests
WHERE invitation_id = ?;
```

### Get Wishes/Comments

```sql
SELECT 
    w.id,
    w.guest_name,
    w.message,
    w.is_attending,
    w.created_at
FROM wishes w
WHERE w.invitation_id = ?
ORDER BY w.created_at DESC
LIMIT 50;
```

---

## Backup & Recovery Information

### Critical Tables (High Priority Backup)

1. **USERS** - Customer data, account status
2. **INVITATIONS** - User-created content
3. **GUESTS** - RSVP data
4. **ORDERS** - Payment records
5. **WISHES** - Guest comments

### Reference Tables (Lower Priority)

- **TEMPLATES** - Can be recreated
- **SETTINGS** - Configuration backup

---

## Growth Considerations

### Data Volume Estimation

- **USERS**: Slow growth (new registrations)
- **INVITATIONS**: Tied to active users
- **GUESTS**: Depends on average guests per invitation (100-500)
- **WISHES**: Depends on engagement rate
- **GALLERY_IMAGES**: Can grow large (JSON array with 50+ URLs)

### Performance Tips

1. Implement pagination for listings
2. Use indexes on frequently queried fields
3. Archive old WISHES after 1 year
4. Optimize gallery_images storage (consider file service)
5. Monitor query performance monthly

---

## Data Retention Policy

### Recommended Retention

- **Active Users**: Keep indefinitely
- **Draft Invitations**: Delete after 12 months
- **Published Invitations**: Keep indefinitely
- **Guest Data**: Keep with invitation
- **Wishes**: Keep indefinitely
- **Orders**: Keep for 7 years (compliance)

