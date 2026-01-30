# Guest Mode Implementation Guide

## Overview

This guide explains the guest mode feature for the AI Student Dashboard PWA. Guest mode allows users to explore the app without authentication while authenticated users get full functionality.

---

## 📋 What's Included

### 1. **Updated Files**

#### `src/context/AuthContext.jsx`
- Added `isGuest` state to track guest mode
- Added `isAuthenticated` computed value (true only for logged-in users)
- New methods:
  - `enterGuestMode()` - Enable guest mode exploration
  - `exitGuestMode()` - Exit guest mode (redirect to signup)
  - `logout()` - Clear all auth state
- Guest preference persisted in localStorage

#### `src/App.jsx`
- New public route: `/home` (landing page)
- Updated routing logic:
  - **Public routes**: `/home`, `/login`, `/signup`
  - **Guest + Authenticated**: `/`, `/ai-tutor`, `/analytics` (use `GuestOrAuthenticatedRoute`)
  - **Protected (auth-only)**: `/messages`, `/team`, `/settings` (use `ProtectedRoute`)
- Proper redirection based on user state

#### `src/components/auth/ProtectedRoute.jsx`
- Updated to distinguish between guests and authenticated users
- Only allows authenticated (non-guest) users
- Optional `onGuestAccess` callback for custom handling

#### `src/components/auth/GuestOrAuthenticatedRoute.jsx`
- New component allowing both guests and authenticated users
- Blocks only unauthenticated (logged-out, non-guest) users
- Used for accessible features like dashboard and AI chat

#### `src/components/auth/GuestBanner.jsx`
- Updated with modern styling
- Shows guest mode indicator
- "Sign Up" button to unlock features
- Optional dismissible property

#### `src/pages/Dashboard.jsx`
- Loads sample data for guests
- Loads real Firestore data for authenticated users
- Shows guest banner at top
- Updated welcome message based on user mode

#### `src/pages/AIChat.jsx`
- **Guest mode**: Sample AI responses (no real API calls)
- **Authenticated mode**: Real GPT-4o responses with persistence
- Guest limitation banner with helpful message
- Sample responses for common topics: photosynthesis, math, essays, history
- No data persistence for guest messages

#### `src/components/layout/Header.jsx`
- Guest indicator in welcome message
- User dropdown menu with:
  - Profile settings (auth-only)
  - Logout button (authenticated)
  - Exit guest mode button (guest)
- Dynamic status text

### 2. **New Files Created**

#### `src/services/guestDataHelpers.js`
Provides sample data for guest users:
- `getGuestSampleTasks()` - 3 sample tasks
- `getGuestSampleNotes()` - 3 sample notes
- `getGuestSampleSubjects()` - 4 sample subjects
- `getGuestSampleAnalytics()` - Sample stats and charts
- `getGuestSampleProfile()` - Guest user profile
- `checkGuestFeatureAccess()` - Check if feature is available in guest mode

#### `src/pages/Home.jsx`
Landing page with:
- Feature showcase grid
- Pricing comparison (Guest vs Full Access)
- CTA buttons: "Try as Guest", "Sign Up Now"
- Marketing copy highlighting key features
- Trust indicators
- Modern gradient design

### 3. **Security Rules Updated**

#### `firestore.rules`
- Guest users cannot read/write any personal data
- Each collection is user-scoped (`{userId}/...`)
- Added detailed comments explaining rules
- Optional public resources section (commented out)

---

## 🚀 How It Works

### User Flow

```
Landing (Home) → Choose Path:
  ├─ Try as Guest → Dashboard (with sample data) → Restricted features show banner
  ├─ Sign Up → Signup page → Create account → Full access
  └─ Log In → Login page → Authenticate → Full access
```

### Guest Mode Behavior

| Feature | Guest | Authenticated |
|---------|-------|---|
| View Dashboard | ✅ (sample data) | ✅ (real data) |
| View Analytics | ✅ (sample stats) | ✅ (real stats) |
| AI Chat | ✅ (sample responses) | ✅ (full GPT-4o) |
| Save Messages | ❌ | ✅ |
| Send Real Messages | ❌ | ✅ |
| Manage Friends | ❌ | ✅ |
| Save Profile | ❌ | ✅ |
| Team Page | ❌ | ✅ |

### State Management

```javascript
// AuthContext provides:
{
  currentUser: FirebaseUser | null,
  isGuest: boolean,
  isAuthenticated: boolean (currentUser && !isGuest),
  loading: boolean,
  enterGuestMode: () => void,
  exitGuestMode: () => void,
  logout: () => Promise<void>
}
```

---

## 💻 Usage Examples

### Detecting Guest Mode in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isGuest, isAuthenticated, currentUser } = useAuth();

  if (isGuest) {
    return <div>Showing sample data for guests</div>;
  }

  if (isAuthenticated) {
    return <div>Welcome {currentUser.displayName}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Loading Data Based on User Mode

```jsx
import { getGuestSampleTasks } from '../services/guestDataHelpers';
import { getTasksFromFirestore } from '../services/firestoreService';

const fetchTasks = async () => {
  if (isGuest) {
    // Use sample data
    const tasks = getGuestSampleTasks();
    setTasks(tasks);
  } else if (currentUser) {
    // Fetch real data
    const tasks = await getTasksFromFirestore(currentUser.uid);
    setTasks(tasks);
  }
};
```

### Restricting Features

```jsx
if (isGuest) {
  return (
    <div className="p-4 bg-amber-50 rounded-lg">
      <p>This feature is available when you sign up.</p>
      <button onClick={() => navigate('/signup')}>
        Sign Up Now
      </button>
    </div>
  );
}

// Otherwise show real feature
return <RealFeatureComponent />;
```

---

## 🔒 Security Considerations

1. **Firestore Rules**: Guest users cannot:
   - Write to any collection
   - Read other users' data
   - Access friend lists or messages
   - Save tasks, notes, or settings

2. **No Data Persistence**: Guest messages/data not saved to Firestore

3. **localStorage**: Guest preference stored locally (safe, easily cleared)

4. **Client-side Checks**: Always validate on backend:
   ```javascript
   // Backend should verify auth before responding with sensitive data
   if (!request.auth) {
     return guestLimitedResponse();
   }
   ```

---

## 📱 Customization

### Change Guest Sample Data

Edit `src/services/guestDataHelpers.js`:

```javascript
export const getGuestSampleTasks = () => [
  {
    id: 'task-1',
    title: 'Your custom task',
    // ... customize properties
  }
];
```

### Modify Guest AI Responses

Edit `src/pages/AIChat.jsx`:

```javascript
const GUEST_SAMPLE_RESPONSES = [
  {
    prompt: ['your keywords'],
    response: 'Your sample response here'
  }
];
```

### Customize Home Page

Edit `src/pages/Home.jsx`:
- Update feature list
- Change pricing
- Modify CTAs
- Update copy

### Change Banner Style

Edit `src/components/auth/GuestBanner.jsx`:
- `variant="info"` - Blue theme
- `variant="warning"` - Amber theme
- Set `dismissible={true}` for closeable banner

---

## 🧪 Testing Guest Mode

1. **Start in Guest Mode**:
   - Go to Home page
   - Click "Try as Guest"
   - Should see dashboard with sample data

2. **Test Restrictions**:
   - Try to access `/messages` (should redirect to login)
   - Try to access `/team` (should redirect to login)
   - AI Chat should show sample responses only

3. **Exit Guest Mode**:
   - Click user menu → "Exit Guest Mode"
   - Should redirect to signup

4. **Persistence**:
   - Reload page in guest mode
   - Should remain in guest mode
   - localStorage has `guestMode: 'true'`

5. **Login After Guest**:
   - In guest mode, click "Sign Up" in banner
   - Create account
   - Should switch from guest to authenticated
   - Real data loads, localStorage cleared

---

## 📊 Analytics Considerations

You might want to track:
- Percentage of users trying guest mode
- Conversion from guest → signup
- Which features guests use most
- Guest session duration

Example tracking:

```javascript
const handleGuestMode = () => {
  enterGuestMode();
  // Track event
  if (window.gtag) {
    gtag('event', 'guest_mode_started');
  }
  navigate('/');
};
```

---

## 🐛 Troubleshooting

### Guest banner not showing
- Check `isGuest` state in AuthContext
- Verify component wraps with `useAuth()`
- Check if `localStorage.getItem('guestMode')` is set

### Sample data not loading
- Verify `getGuestSampleTasks()` is imported
- Check if `isGuest` condition works
- Ensure fallback to sample data in try-catch

### Firestore rules issues
- Deploy updated rules to Firebase Console
- Check that authenticated users can still write
- Verify guests can't write (expected)

### Routing loops
- Ensure `GuestOrAuthenticatedRoute` wraps guest-accessible pages
- Check `ProtectedRoute` only blocks guests, not guests+unauth
- Verify Home page doesn't require auth

---

## 📝 Notes for Future Enhancement

1. **Analytics Dashboard**: Add real analytics for authenticated users
2. **Guest Expiration**: Add optional 30-day guest session limit
3. **Social Login**: Add Google/GitHub for frictionless signup
4. **Progressive Features**: Unlock features gradually in guest mode
5. **Offline Support**: Extend offline persistence to guest mode
6. **A/B Testing**: Test different CTAs and sample data
7. **Email Capture**: Get guest email before letting them explore fully

---

## 🎯 Key Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/context/AuthContext.jsx` | Guest state management | ✅ Updated |
| `src/App.jsx` | Routing with guest support | ✅ Updated |
| `src/pages/Home.jsx` | Landing page | ✅ Created |
| `src/pages/Dashboard.jsx` | Dashboard with guest data | ✅ Updated |
| `src/pages/AIChat.jsx` | AI with guest responses | ✅ Updated |
| `src/services/guestDataHelpers.js` | Sample data | ✅ Created |
| `src/components/auth/GuestBanner.jsx` | Guest indicator | ✅ Updated |
| `src/components/layout/Header.jsx` | Header with guest support | ✅ Updated |
| `firestore.rules` | Security rules | ✅ Updated |

---

## 🚀 Next Steps

1. Test guest mode thoroughly
2. Update other pages (Notes, StudyPlanner) to support guest data
3. Deploy updated Firestore rules
4. Add analytics tracking
5. Monitor guest → signup conversion
6. Iterate on CTAs and messaging based on user feedback

---

**Ready to launch! Guest mode provides a frictionless way for users to experience your app before committing to an account.** 🎉
