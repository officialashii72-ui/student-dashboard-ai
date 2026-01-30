# 🚀 Guest Mode Deployment Checklist

## Pre-Deployment (Local Testing)

### Code Review
- [ ] Review all code changes
- [ ] Check for console errors: `npm run dev`
- [ ] Run in incognito/private window (fresh state)
- [ ] No TypeScript/linting errors

### Functional Testing

#### Guest Mode Flow
- [ ] Navigate to `/home` (landing page loads)
- [ ] Click "Try as Guest" button
- [ ] Redirected to `/`
- [ ] Dashboard shows sample data (3 tasks, 3 notes, etc.)
- [ ] GuestBanner appears at top
- [ ] localStorage shows `guestMode: 'true'`

#### Dashboard (Guest)
- [ ] Tasks card shows 3 sample tasks
- [ ] Notes card shows 3 sample notes
- [ ] Subjects show 4 items
- [ ] Stats calculate correctly
- [ ] No Firestore errors in console

#### AI Chat (Guest)
- [ ] Chat page loads
- [ ] Try: "explain photosynthesis"
- [ ] Get sample response (not empty)
- [ ] Try: "help with math"
- [ ] Get different sample response
- [ ] Try: random text
- [ ] Get generic "sign up" response
- [ ] No Firestore write attempts
- [ ] Message doesn't persist on reload

#### Analytics (Guest)
- [ ] Page loads without errors
- [ ] Shows sample analytics data
- [ ] Charts render properly

#### Restricted Routes (Guest)
- [ ] Try `/messages` → redirects to `/login`
- [ ] Try `/team` → redirects to `/login`
- [ ] Try `/settings` → redirects to `/login`

#### Header & Menu (Guest)
- [ ] Welcome message says "Guest User"
- [ ] User menu shows "Exit Guest Mode"
- [ ] Click "Exit Guest Mode" → redirects to `/signup`
- [ ] No "Profile Settings" option visible

#### Guest to Auth Flow
- [ ] In guest mode, click "Sign Up" in banner
- [ ] Redirected to `/signup`
- [ ] Fill signup form
- [ ] Create account
- [ ] Auto-redirected to dashboard
- [ ] isGuest is false
- [ ] currentUser exists
- [ ] localStorage cleared (no `guestMode`)

#### Authenticated Flow
- [ ] Sign up and create account ✅
- [ ] Dashboard shows empty lists (first time)
- [ ] Can navigate all pages
- [ ] AI Chat saves messages
- [ ] Can access `/messages`, `/team`, `/settings`

#### Logout
- [ ] Click user menu
- [ ] Click "Log Out"
- [ ] Redirected to `/home`
- [ ] Firebase auth cleared
- [ ] localStorage cleared

### Theme Testing
- [ ] Light mode - all components visible
- [ ] Dark mode - all components visible
- [ ] Toggle doesn't break layout
- [ ] GuestBanner readable in both modes

### Device Testing
- [ ] Desktop (1920px+)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Navigation works on all sizes
- [ ] Text readable on all sizes
- [ ] Buttons clickable on mobile

### Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari

### Performance
- [ ] Page loads quickly
- [ ] No lag when navigating
- [ ] Sample data renders instantly
- [ ] No memory leaks (check DevTools)

---

## Firebase Console Setup

### Deploy Firestore Rules

1. **Open Firebase Console**
   - Go to firebase.google.com
   - Select your project
   - Click "Firestore Database"
   - Click "Rules" tab

2. **Copy New Rules**
   - Open `firestore.rules` in your project
   - Copy entire contents

3. **Paste in Console**
   - Clear existing rules in console
   - Paste new rules
   - Should look like this:
     ```
     rules_version = '2';
     
     service cloud.firestore {
       match /databases/{database}/documents {
         // ... rules here
       }
     }
     ```

4. **Test Rules**
   - Click "Rules Playground"
   - Test: Guest read (should deny)
   - Test: Guest write (should deny)
   - Test: Auth read own data (should allow)
   - Test: Auth write own data (should allow)

5. **Publish**
   - Click "Publish"
   - Wait for deployment (1-2 min)
   - Confirm deployment successful

### Verify Rules
- [ ] Rules deployed in Firebase Console
- [ ] Rules Playground tests pass
- [ ] Guest cannot read user data
- [ ] Guest cannot write anything
- [ ] Auth users can read/write own data

---

## Build & Deployment

### Local Build Test
```bash
# Build
npm run build

# Should complete without errors
# Should show: "✓ built in X.XXs"

# Preview build
npm run preview

# Test in browser at localhost:4173
# Guest mode should still work
```

### Choose Deployment Platform

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Follow prompts
# Production deployment
# Note: Check environment variables
```

#### Option B: Netlify
```bash
# Build
npm run build

# Deploy built folder to Netlify
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod
```

#### Option C: Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy

# Note: Only builds app, rules separate
```

#### Option D: Other (AWS, Heroku, etc.)
- Ensure Node.js 18+ available
- Set build command: `npm run build`
- Set output directory: `dist`
- Ensure PORT env var supported

### Deployment Checklist
- [ ] Build completes successfully
- [ ] No build errors or warnings
- [ ] Environment variables set (if any)
- [ ] Deploy command executed
- [ ] Deployment completes
- [ ] No errors during deployment
- [ ] URL provided by platform

---

## Post-Deployment Testing

### Live URL Testing
- [ ] App loads on production URL
- [ ] No console errors
- [ ] Guest mode works
- [ ] Auth flows work
- [ ] Sample data loads

### Functional Testing (Production)
- [ ] Try guest mode flow
- [ ] Try auth flows
- [ ] Try restricted routes
- [ ] Test on mobile
- [ ] Test in different browsers

### Performance Testing
```
Good target metrics:
- Page load: < 3 seconds
- AI Chat response: < 2 seconds
- Dashboard render: < 1 second
```

### Error Monitoring
- [ ] Set up error tracking (optional)
  - Sentry
  - LogRocket
  - Firebase Crashlytics
  - DataDog
- [ ] Monitor for any errors
- [ ] Check console regularly

### Analytics Setup (Optional)
```javascript
// Track guest mode activation
gtag('event', 'guest_mode_started');

// Track conversion
gtag('event', 'guest_to_signup');

// Track feature usage
gtag('event', 'guest_ai_chat_used');
```

---

## Monitoring & Optimization

### First Week

- [ ] Monitor error logs daily
- [ ] Check user feedback
- [ ] Review analytics
- [ ] Guest activation rate
- [ ] Signup conversion rate

### Common Issues

| Issue | Solution |
|-------|----------|
| Guests can write | Update Firestore rules, publish |
| Sample data missing | Check guestDataHelpers imports |
| Routes not working | Check App.jsx routing structure |
| Dark mode broken | Check Tailwind classes |
| Mobile layout issues | Check responsive classes |

### Performance Optimization

- [ ] Enable caching headers
- [ ] Compress images
- [ ] Lazy load components
- [ ] Minify code (automatic)
- [ ] Optimize bundle size

---

## Rollback Plan

If something breaks:

### Quick Rollback (if within 24 hours)
```bash
# Revert to previous commit
git revert <commit-hash>

# Redeploy
vercel deploy --prod
# Or your platform's deploy command
```

### Firebase Rules Rollback
- [ ] Go to Firebase Console > Firestore > Rules
- [ ] Click "Cloud Firestore Rules" in left sidebar
- [ ] Find previous version
- [ ] Click "Restore"
- [ ] Confirm restore

---

## Success Criteria

Deployment is successful when:

✅ App loads without errors
✅ Guest mode fully functional
✅ Auth flows work
✅ Firestore rules enforced
✅ No console errors
✅ Mobile responsive
✅ Dark mode works
✅ Sample data loads
✅ Analytics tracking (if implemented)

---

## Post-Launch Monitoring

### Daily (First Week)
- [ ] Check error logs
- [ ] Test guest mode flow
- [ ] Monitor conversation with users

### Weekly (First Month)
- [ ] Review analytics
- [ ] Guest activation rate
- [ ] Signup conversion rate
- [ ] User feedback
- [ ] Performance metrics

### Monthly (Ongoing)
- [ ] Optimize based on metrics
- [ ] Update CTAs if needed
- [ ] Refine sample data
- [ ] Monitor user retention

---

## Optional Enhancements

After successful launch:

- [ ] Email capture during guest mode
- [ ] Guest session time limit
- [ ] A/B test different CTAs
- [ ] Add social proof
- [ ] Personalized recommendations
- [ ] Guest user surveys
- [ ] Feature upgrade prompts

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Try build again
npm run build
```

### Deployment Fails
- Check platform logs
- Verify environment variables
- Check Node.js version
- Try deploying from main branch

### Production Issues
- Check browser console
- Check Firebase logs
- Check deployment platform logs
- Rollback if needed

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Netlify Docs](https://docs.netlify.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

## Final Checklist

Before declaring launch complete:

- [x] Code tested locally ✅
- [x] Firebase rules updated ✅
- [x] Build passes ✅
- [x] Deployed to production ✅
- [x] Live URL functional ✅
- [x] All scenarios tested ✅
- [x] No console errors ✅
- [x] Performance acceptable ✅
- [x] Team notified ✅
- [x] Monitoring set up ✅

---

## 🎉 You're Live!

Your guest mode feature is now live in production. 

**Next steps:**
1. Share the link with team
2. Announce feature to users
3. Monitor metrics
4. Iterate based on feedback
5. Plan enhancements

---

**Congratulations on launching guest mode! 🚀**

Monitor the metrics closely in the first week and be ready to make quick adjustments based on user behavior.
