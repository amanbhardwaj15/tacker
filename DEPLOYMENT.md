# 🚀 Deployment Guide — Spyne Content Tracker

Follow these steps in order. Total time: ~15 minutes. No coding required.

---

## PART 1: Create Your Cloud Database (Neon — Free)

1. Go to **https://neon.tech** and click **Sign up** (use Google login for speed)
2. Click **Create a project**
3. Name it: `spyne-tracker` → Click **Create**
4. You'll see a box called **Connection string**
5. Click **Copy** — it looks like:
   `postgresql://user:abc123@ep-cool-name.aws.neon.tech/neondb?sslmode=require`
6. **Paste it somewhere safe** (Notepad). You'll need it twice.

---

## PART 2: Put Your Code on GitHub

### If your code is NOT on GitHub yet:

1. Go to **https://github.com/new**
2. Repository name: `spyne-content-tracker`
3. Choose **Private**
4. **DO NOT** check "Add a README"
5. Click **Create repository**
6. Click **"uploading an existing file"**
7. Drag ALL your project files into the box
   - ⚠️ IMPORTANT: Do NOT upload the `.next` folder or `node_modules` folder
   - Upload everything else (src folder, package.json, etc.)
8. Click **Commit changes**

### If your code IS already on GitHub:
Just make sure these files are NOT uploaded (delete them if present):
- `firebase.json`, `.firebaserc`
- The `workflows` folder (the standalone one, not `.github`)
- Any `webpack.yml` file

---

## PART 3: Deploy on Vercel (Free & Easy)

1. Go to **https://vercel.com**
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access GitHub
4. On your dashboard, click **Add New...** → **Project**
5. Find `spyne-content-tracker` in the list → click **Import**
6. Before deploying, click **Environment Variables** and add:
   - **Name:** `DATABASE_URL`
   - **Value:** paste your Neon connection string (from Part 1)
   - Click **Add**
7. Click **Deploy**
8. Wait 2-3 minutes ⏳

🎉 **Done!** Vercel gives you a live URL like `spyne-content-tracker.vercel.app`

---

## PART 4: Create Your Database Tables (One Time)

Your app is live but the database is empty. Create the tables:

### Easiest Method — Neon SQL Editor:

1. Go back to **https://neon.tech** → open your project
2. Click **SQL Editor** in the left menu
3. Copy the ENTIRE contents of the file `database-setup.sql` (included in your project)
4. Paste it into the SQL Editor
5. Click **Run**

✅ Your tables are now created. Refresh your live app — it works!

---

## Making Changes Later

Whenever you want to update your app:
1. Edit files on GitHub (or re-upload)
2. Vercel **automatically redeploys** — no action needed!

---

## Troubleshooting

**App shows errors / no data loads?**
- Check DATABASE_URL is added correctly in Vercel → Settings → Environment Variables
- Make sure you ran the SQL in Part 4

**Build failed on Vercel?**
- Make sure you did NOT upload `.next` or `node_modules` folders
- Vercel builds these automatically

**Need to update DATABASE_URL?**
- Vercel → your project → Settings → Environment Variables → Edit
- Then go to Deployments → click ⋯ → Redeploy
