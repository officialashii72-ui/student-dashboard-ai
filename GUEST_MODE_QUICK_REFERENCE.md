# Guest Mode Quick Reference

## 🎯 Key Concepts

```
Guest User         = User exploring without login
Authenticated User = User with valid Firebase auth
```

## 📦 State from AuthContext

```jsx
const {
  currentUser,      // Firebase user object or null
  isGuest,          // true = guest mode
  isAuthenticated,  // true = logged in, false = guest or no auth
  loading,          // Auth check in progress
  enterGuestMode,   // () => Enable guest mode
  exitGuestMode,    // () => Disable guest mode
  logout            // () => Log out
} = useAuth();
```

## 🛣️ Route Types

### Public Routes
Anyone can access (no login required):
- `/home` - Landing page
- `/login` - Login form
- `/signup` - Signup form

### Guest + Authenticated Routes
Both guests and logged-in users:
- `/` - Dashboard
- `/ai-tutor` - AI Chat
- `/analytics` - Analytics

*Use `<GuestOrAuthenticatedRoute>`*

### Protected Routes
Authenticated users only:
- `/messages` - Chat
- `/team` - Team management
- `/settings` - Settings

*Use `<ProtectedRoute>`*

## 🎨 Common Patterns

### Show/Hide Based on Auth Status

```jsx
{isGuest && <GuestBanner />}

{isAuthenticated && <RealFeature />}

{!isGuest && <AuthOnlyFeature />}
```

### Load Different Data

```jsx
const data = isGuest 
  ? getGuestSampleTasks() 
  : await getTasksFromFirestore(currentUser.uid);
```

### Conditional Navigation

```jsx
const handleAction = () => {
  if (isGuest) {
    toast.info('Sign up to unlock this feature');
    navigate('/signup');
  } else {
    performAction();
  }
};
```

## 📁 Key Files

| Path | Purpose |
|------|---------|
| `src/context/AuthContext.jsx` | Auth state + guest logic |
| `src/App.jsx` | Route configuration |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/Dashboard.jsx` | Sample data for guests |
| `src/pages/AIChat.jsx` | Sample responses for guests |
| `src/services/guestDataHelpers.js` | Sample data functions |
| `src/components/auth/GuestBanner.jsx` | Guest indicator |
| `src/components/layout/Header.jsx` | User menu with logout |
| `firestore.rules` | Security rules |

## 🔐 Sample Firestore Structure

```
users/
  {userId}/
    profile
    settings
    
tasks/
  {userId}/
    task1
    task2
    
notes/
  {userId}/
    note1
    note2
    
ai-chats/
  {userId}/
    message1
    message2
```

**Guests cannot access any of this** ✅

## 🎯 Sample Data Functions

```jsx
import {
  getGuestSampleTasks,
  getGuestSampleNotes,
  getGuestSampleSubjects,
  getGuestSampleAnalytics,
  getGuestSampleProfile,
  checkGuestFeatureAccess
} from '../services/guestDataHelpers';

// Use these instead of Firestore for guests
const tasks = isGuest 
  ? getGuestSampleTasks() 
  : firestoreTasks;
```

## 🚀 Guest Mode Journey

```
User visits /home
        ↓
    "Try as Guest" clicked
        ↓
    enterGuestMode() called
    navigate('/') 
        ↓
    Dashboard shows sample data + GuestBanner
        ↓
    Guest explores AI Chat, sees sample responses
        ↓
    User clicks "Sign Up" in banner
        ↓
    Signup form
        ↓
    Account created, authenticated
    exitGuestMode() called automatically
        ↓
    Now sees real data, can save
```

## 💡 Debugging Tips

### Check Guest Status
```js
// In browser console
localStorage.getItem('guestMode')  // 'true' or null
```

### Check Auth State
```js
// In browser console
firebase.auth().currentUser  // User object or null
```

### Force Guest Mode (dev)
```js
// In browser console
localStorage.setItem('guestMode', 'true')
location.reload()
```

### Clear Guest Mode (dev)
```js
// In browser console
localStorage.removeItem('guestMode')
location.reload()
```

## ✅ Testing Scenarios

### Scenario 1: Try Guest Mode
1. Go to `/home`
2. Click "Try as Guest"
3. See dashboard with sample data
4. All features show "upgrade prompts"

### Scenario 2: Guest → Signup
1. In guest mode, click "Sign Up"
2. Create account
3. Should switch to authenticated automatically
4. Now see real data (empty for new user)

### Scenario 3: Restricted Routes
1. In guest mode, try `/messages`
2. Should redirect to `/login`
3. Same for `/team` and `/settings`

### Scenario 4: Persistence
1. In guest mode, reload page
2. Should remain in guest mode
3. Check localStorage confirms it

### Scenario 5: Exit Guest
1. In guest mode, click user menu
2. Click "Exit Guest Mode"
3. Should redirect to `/signup`

## 🎓 Sample AI Responses

For guests, these topics have sample responses:
- "explain photosynthesis"
- "help with math"
- "essay writing"
- "french history"

Any other question gets generic "sign up for full AI" response.

## 🔒 Security Checklist

- ✅ Guests cannot write to Firestore
- ✅ Guests cannot read other users' data
- ✅ Firestore rules enforce authentication
- ✅ No sensitive data in localStorage
- ✅ Guest preference easily cleared
- ✅ Messages not saved for guests
- ✅ Friend lists protected

## 🎯 Conversion Goals

Track these metrics:
1. **Guest activation** - How many try guest mode?
2. **Conversion** - Guest → signup rate?
3. **Feature usage** - What do guests use most?
4. **Bounce rate** - Where do guests leave?
5. **Time in app** - How long do guests stay?

## 📱 Responsive Design

All guest mode components are mobile-responsive:
- Home page ✅
- Guest banner ✅
- Dashboard ✅
- AI Chat ✅
- Header menu ✅

## 🌙 Dark Mode Support

All components support light/dark theme:
- Guest banner ✅
- Home page ✅
- All sample data ✅

## 🚦 Next: Additional Pages

Consider updating these for guest mode:
- [ ] TaskManager - Show sample tasks?
- [ ] Notes - Show sample notes?
- [ ] StudyPlanner - Show sample schedule?
- [ ] AITaskAssistant - Show sample assistance?

**Not urgent** - Core features (Dashboard, AI Chat) are done.

---

**Ready to launch guest mode!** 🚀
