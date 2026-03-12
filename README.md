# Auto Planet — Luxury Dealership Site

A simple HTML/CSS/JS dealership site with a tiny Netlify backend.

## What this gives you
- Premium black + gold dealership design
- Public homepage, inventory, and vehicle detail pages
- Admin login page
- New Listing form with image upload
- Delete listing from the admin dashboard
- Data saved with Netlify Blobs as JSON

## Folder overview
- `index.html` — homepage
- `inventory.html` — all listings
- `vehicle.html` — vehicle details
- `admin/login.html` — admin login
- `admin/dashboard.html` — add/delete listings
- `netlify/functions` — tiny backend

## Deploy to Netlify
1. Unzip the project.
2. Push it to GitHub.
3. In Netlify, import the repo.
4. In **Site configuration → Environment variables**, add:
   - `ADMIN_PASSWORD` = choose your dad's password
   - `TOKEN_SECRET` = any long random string
5. Deploy.

## Important
Netlify will install the dependency from `package.json` during the build.  
The public site itself is plain HTML/CSS/JS. The only dependency is for the serverless function data store.

## How your dad uses it
1. Go to `/admin/login.html`
2. Enter the admin password
3. Add a listing
4. Upload photos
5. Publish

## Local preview
You can open the public HTML pages directly in a browser for design preview.
The backend features need Netlify Dev or a deployed Netlify site.

## Change contact info
Edit these files if needed:
- `index.html`
- `vehicle.html`
- `js/app.js`

## Default sample listings
The first deploy seeds a few starter vehicles automatically.
