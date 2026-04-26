# Rabotec SafeReport 🪖

**HSE Hazard Reporting Web App** for Rabotec (Mining · Engineering · Construction)

A fully offline-capable, single-file hazard reporting tool backed by Google Sheets via Google Apps Script.

---

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | Complete front-end app (single file, no dependencies) |
| `Code.gs` | Google Apps Script backend — paste into your GAS project |

---

## 🚀 Setup

### 1. Google Sheet
- Create a new Google Sheet
- Rename the first sheet tab to exactly: **`Reports`**
- Leave it blank — headers are created automatically on first submission

### 2. Google Apps Script
- In your Sheet, go to **Extensions → Apps Script**
- Delete any existing code and paste the contents of `Code.gs`
- Click **Deploy → New deployment**
  - Type: **Web app**
  - Execute as: **Me**
  - Who has access: **Anyone**
- Copy the deployment URL

### 3. Front-end
- Open `index.html` and confirm the `GAS_URL` constant matches your deployment URL
- Host `index.html` anywhere (GitHub Pages, local file, web server)

---

## 🔑 Admin Panel

The admin dashboard is hidden from normal navigation.  
Access it by adding `?view=admin` to the URL:

```
https://yoursite.com/index.html?view=admin
```

Default password: `admin123`  
*(Change `ADMIN_PW` in the `<script>` section of `index.html` before deploying)*

---

## ✈️ Offline Support

Reports submitted while offline are saved to a local outbox (`localStorage`) and automatically synced when connectivity is restored. A banner shows the number of queued reports with a manual **Retry Now** button.

---

## 🛠 Features

- ✅ Department, work area, shift, date/time fields
- ✅ Severity selector (Low / Medium / High / Critical)
- ✅ Multi-select hazard type checkboxes
- ✅ Description, conditions, and actions taken
- ✅ Observer name, badge number, contact
- ✅ Offline outbox with auto-sync
- ✅ Admin dashboard (stats, filter, status update, delete)
- ✅ Duplicate submission prevention (server-side ID check)
- ✅ Fully responsive — mobile friendly

---

## 🎨 Branding

Colors: Rabotec Blue `#003DA5` · Red `#D0021B` · White  
Fonts: Barlow Condensed (headings) + Barlow (body) via Google Fonts

---

## ⚠️ Re-deploying GAS

After any change to `Code.gs`, always create a **new version** when redeploying:  
**Deploy → Manage deployments → Edit (✏️) → Version: New version → Deploy**

Updating without a new version means the old cached code keeps running.
