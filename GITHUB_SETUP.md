# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in top right → "New repository"
3. Repository name: **RideHub**
4. Description: "A modern vehicle rental platform built with MERN stack, featuring luxury UI and Razorpay payments"
5. Select **Public** or **Private**
6. **DO NOT** initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Link Local Repository to GitHub

After creating the GitHub repository, run these commands:

```powershell
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/RideHub.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Update README with Your Info

1. Open `README.md`
2. Replace these placeholders:
   - `yourusername` → Your GitHub username
   - `your.email@example.com` → Your email
   - `Your Name` → Your name

## Step 4: Add Repository Topics (Optional)

On GitHub repository page:
- Click "Add topics"
- Add: `mern-stack`, `vehicle-rental`, `razorpay`, `mongodb`, `react`, `nodejs`, `tailwindcss`

## Step 5: Add Environment Variables to .env.example

Create `backend/.env.example` for other developers:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PAYMENT_MODE=mock
```

## Step 6: Verify Everything is Pushed

Check your GitHub repository page - you should see:
- ✅ README.md with project info
- ✅ PROJECT_DOCUMENTATION.md (your detailed docs)
- ✅ backend/ folder
- ✅ frontend/ folder
- ✅ .gitignore (node_modules and .env excluded)

## Important Notes

### What's NOT Pushed to GitHub (Good!)
- ❌ `node_modules/` (too large, can be reinstalled)
- ❌ `.env` (contains secrets)
- ❌ `backend/uploads/*` (user-uploaded images)
- ❌ IDE settings

### What IS Pushed to GitHub (Good!)
- ✅ All source code
- ✅ package.json files
- ✅ README and documentation
- ✅ Sample data in seeder.js

## Repository Structure on GitHub

```
RideHub/
├── .gitignore
├── README.md                    # Public GitHub README
├── PROJECT_DOCUMENTATION.md     # Your detailed documentation
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example            # Template for environment variables
│   ├── package.json
│   ├── seeder.js
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── tailwind.config.js
```

## Cloning Your Repository (For Others)

When someone wants to use your project:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/RideHub.git
cd RideHub

# Backend setup
cd backend
npm install
# Create .env file and add credentials
npm start

# Frontend setup
cd ../frontend
npm install
npm start
```

## Future Updates

To push updates to GitHub:

```powershell
# Stage changes
git add .

# Commit with message
git commit -m "Add new feature: vehicle reviews"

# Push to GitHub
git push origin main
```

## Troubleshooting

### Issue: "Repository not found"
- Check repository name spelling
- Verify you're logged into correct GitHub account
- Make sure repository is created on GitHub

### Issue: "Permission denied"
- Set up SSH key or use HTTPS with personal access token
- Check GitHub authentication

### Issue: "Large files rejected"
- Make sure .gitignore is working
- Remove node_modules before pushing

## Success Checklist

- [ ] GitHub repository created
- [ ] Local repo linked to GitHub
- [ ] Code pushed successfully
- [ ] README updated with your info
- [ ] .env.example created
- [ ] Repository topics added
- [ ] Repository is public/private as desired

---

**Your repository is now ready! 🎉**

Share it: `https://github.com/YOUR_USERNAME/RideHub`
