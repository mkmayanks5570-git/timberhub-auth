# TimberHub Authentication Portal Deployment Guide

This directory contains the static authentication portal for TimberHub ERP. It handles email verification and password resets using the Supabase JS client.

## 1. Configure the JavaScript Client

Before deploying, you must configure your Supabase credentials.

1. Open `script.js` in a text editor.
4. Save the file.

## 2. GitHub Upload & Pages Configuration

1. Create a new public repository on GitHub named `timberhub-auth`.
2. Open a terminal in `C:\Projects\timberhub-auth` and run:
   ```bash
   git remote add origin https://github.com/<your-username>/timberhub-auth.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings > Pages**.
4. Under **Source**, select `Deploy from a branch`.
5. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
6. Wait 1-2 minutes for the site to deploy. Note your GitHub Pages URL (e.g., `https://<your-username>.github.io/timberhub-auth/`).

## 3. Supabase Configuration

Log into your Supabase Dashboard and configure the following settings:

### URL Configuration (Authentication > URL Configuration)
*   **Site URL**: `https://<your-username>.github.io/timberhub-auth/`
*   **Redirect URLs**: Add `https://<your-username>.github.io/timberhub-auth/*`

### Email Templates (Authentication > Email Templates)

Update the URLs in your email templates to point to your new hosted pages:

**Confirm Signup Template:**
Change the link to point to your `verify.html` page:
```html
<a href="{{ .SiteURL }}/verify.html?type=signup&token_hash={{ .TokenHash }}">Verify Email</a>
```
*(Note: Supabase PKCE flow usually passes a token_hash which is automatically handled by the Supabase server, and then the server redirects to your Site URL.)*

**Reset Password Template:**
Change the link to point to your `reset.html` page:
```html
<a href="{{ .SiteURL }}/reset.html?type=recovery&token_hash={{ .TokenHash }}">Reset Password</a>
```

### SMTP Checklist (Settings > Email)
If you haven't already, configure a custom SMTP server to ensure deliverability (e.g., SendGrid, AWS SES, or Mailgun).
*   [ ] SMTP Host
*   [ ] SMTP Port (usually 465 or 587)
*   [ ] SMTP User
*   [ ] SMTP Password
*   [ ] Sender Email Address (e.g., `noreply@timberhub.app`)
*   [ ] Sender Name (TimberHub ERP)

## 4. Verification

1. Attempt to sign up a new user via the TimberHub desktop app.
2. Click the link in the verification email. Ensure it opens `verify.html` and displays the success message.
3. Request a password reset.
4. Click the link in the password reset email. Ensure it opens `reset.html` and successfully updates your password.
