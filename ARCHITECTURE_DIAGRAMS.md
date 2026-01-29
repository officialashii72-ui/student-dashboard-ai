# Guest Mode Architecture Diagrams

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App Component                          │
│  (Router + AuthProvider)                                    │
└─────────────┬───────────────────────────────────────────────┘
              │
      ┌───────┴────────────────────┬──────────────┐
      │                            │              │
   Public                   Guest + Auth      Protected
   Routes                    Routes            Routes
   ├─ /home                 ├─ /             ├─ /messages
   ├─ /login                ├─ /ai-tutor     ├─ /team
   ├─ /signup               ├─ /analytics    ├─ /settings
      │
      └─ GuestOr              └─ Protected
        AuthenticatedRoute        Route
      │                        │
      └──────────┬────────────┘
                 │
         ┌───────▼──────────┐
         │  Layout          │
         │  ├─ Header       │
         │  ├─ Sidebar      │
         │  └─ Main Content │
         └──────────────────┘
```

## 🔄 Authentication State Flow

```
                    ┌─────────────────┐
                    │  AuthContext    │
                    │  useAuth()      │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
      ┌───▼──┐          ┌────▼─────┐       ┌──▼──────┐
      │Guest │          │Auth User  │       │Loading  │
      │ Mode │          │(Firebase) │       │State    │
      └───┬──┘          └────┬─────┘       └──┬──────┘
          │                  │                 │
      isGuest:          isAuthenticated:   loading:
      true              true                true
      currentUser:      currentUser:      [shows spinner]
      null              {user object}
      
      Data:             Data:
      Sample only       From Firestore
      No persist        Persisted
```

## 🧠 Component Hierarchy

```
App
│
├─ AuthProvider
│  │
│  └─ Router
│     │
│     ├─ /home → Home.jsx
│     │
│     ├─ /login → Login.jsx
│     │
│     ├─ /signup → Signup.jsx
│     │
│     └─ /*
│        │
│        └─ GuestOrAuthenticatedRoute
│           │
│           └─ Layout
│              │
│              ├─ Header (shows guest/auth status)
│              │  │
│              │  └─ User menu (logout, exit guest)
│              │
│              ├─ Sidebar
│              │
│              └─ Main content:
│                 │
│                 ├─ Dashboard/
│                 │  ├─ GuestBanner
│                 │  ├─ Stats cards
│                 │  ├─ TaskManager
│                 │  ├─ StudyPlanner
│                 │  └─ Notes
│                 │
│                 ├─ AIChat/
│                 │  ├─ GuestBanner
│                 │  └─ Sample/Real responses
│                 │
│                 ├─ Analytics/
│                 │  └─ Sample/Real data
│                 │
│                 └─ (Protected routes via ProtectedRoute)
│                    ├─ Messages
│                    ├─ Team
│                    └─ Settings
```

## 🔐 Data Flow Diagram

```
Guest User                          Authenticated User
     │                                    │
     │ No localStorage                    │ Firebase Auth Token
     │ guestMode: 'true'                  │ in localStorage
     │                                    │
     ▼                                    ▼
┌─────────────────────────┐      ┌──────────────────────┐
│ Request Dashboard Data  │      │Request Dashboard Data│
└──────────┬──────────────┘      └──────────┬───────────┘
           │                                 │
           ▼                                 ▼
┌─────────────────────────┐      ┌──────────────────────┐
│getGuestSampleTasks()    │      │getTasksFromFirestore()│
│- Return sample tasks    │      │- Query with auth uid │
│- No API call            │      │- Fetch from database │
│- Instant (no loading)   │      │- Real user's data    │
└──────────┬──────────────┘      └──────────┬───────────┘
           │                                 │
           ▼                                 ▼
┌─────────────────────────┐      ┌──────────────────────┐
│ Component renders       │      │ Component renders    │
│ with sample data        │      │ with real data       │
└──────────┬──────────────┘      └──────────┬───────────┘
           │                                 │
           ▼                                 ▼
       ["Sample task"]         ["Real task", "Real task"]
```

## 🔒 Firestore Security Rules Flow

```
Request comes in
      │
      ▼
Is it a Firestore collection?
      │
   ┌──┴──┐
   │     │
  Yes   No → (ignore)
   │
   ▼
Match collection path pattern
      │
   ┌──┼──┬──┐
   │  │  │  │
users ai-chats friends messages
   │
   ▼
Check: request.auth != null
(User must be authenticated)
   │
   ├─ true: Is auth.uid == {userId} in path?
   │  ├─ true: ALLOW read/write ✅
   │  └─ false: DENY ❌
   │
   └─ false: DENY ❌
      (Guest users cannot write)
```

## 🎯 User Journey Map

```
                    START: Visit /home
                           │
                           ▼
                    ┌──────────────┐
                    │ Landing Page │
                    │ (Home.jsx)   │
                    └──┬───────┬──┬┘
                       │       │  │
         ┌─────────────┘       │  └────────────┐
         │                     │               │
         ▼                     ▼               ▼
    [Try Guest]          [Sign Up]        [Log In]
         │                  │                 │
         ▼                  ▼                 ▼
    enterGuest        navigate to        navigate to
    Mode()            /signup            /login
         │                  │                 │
         ▼                  ▼                 ▼
    ┌─────────┐         ┌────────┐       ┌────────┐
    │ GUEST   │         │Sign up │       │Login   │
    │ MODE    │────────▶│Form    │───┬──▶│Form    │
    │         │   Can   └────────┘   │   └────────┘
    └────┬────┘   also             │
         │        get here          │
         │                          │
         │  ┌─────────────────────┘
         │  │
         ▼  ▼
    ┌──────────────────────┐
    │ AUTHENTICATED MODE   │
    │ (Firebase auth       │
    │  user exists)        │
    └──────────────────────┘
         │
         ▼
    Full app access
    Real data
    All features
    Can save/sync
```

## 📱 Component State Tree

```
AuthContext
├─ currentUser: FirebaseUser | null
├─ isGuest: boolean
├─ isAuthenticated: boolean ← computed
├─ loading: boolean
├─ enterGuestMode() → sets isGuest: true, clears currentUser
├─ exitGuestMode() → sets isGuest: false
└─ logout() → clears both

Dashboard
├─ tasks: Task[] (guest sample or real)
├─ notes: Note[] (guest sample or real)
├─ subjects: Subject[] (guest sample or real)
├─ loading: boolean
└─ fetchAllData() → calls helper or Firestore

AIChat
├─ messages: Message[]
├─ input: string
├─ isThinking: boolean
└─ handleSendMessage() → sample response or API

Header
├─ showUserMenu: boolean
└─ handleLogout() → calls auth.logout()
```

## 🔄 Feature Access Matrix

```
Feature          │ Guest │ Auth │ Implementation
─────────────────┼───────┼──────┼──────────────────────────
Dashboard        │  ✅   │  ✅  │ Load sample/real data
AI Chat          │  ✅   │  ✅  │ Sample/real responses
Analytics        │  ✅   │  ✅  │ Sample/real stats
Messages         │  ❌   │  ✅  │ ProtectedRoute
Team             │  ❌   │  ✅  │ ProtectedRoute
Settings         │  ❌   │  ✅  │ ProtectedRoute
Save Tasks       │  ❌   │  ✅  │ Firestore + auth check
Save Notes       │  ❌   │  ✅  │ Firestore + auth check
Save AI History  │  ❌   │  ✅  │ Firestore + auth check
Profile Pic      │  ❌   │  ✅  │ Firestore + auth check
Friend Requests  │  ❌   │  ✅  │ Firestore + auth check
```

## 🚀 Deployment Flow

```
Development
    │ (npm run dev)
    │
    ▼
┌─────────────────────┐
│ Test all scenarios: │
│ - Try guest mode    │
│ - Auth flows        │
│ - Restricted routes │
│ - Data loading      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Update Firebase     │
│ Rules in Console    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Build               │
│ npm run build       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Deploy              │
│ (Vercel/Netlify/    │
│  Firebase Hosting)  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Production Testing: │
│ - Test on live URL  │
│ - Mobile devices    │
│ - Monitor errors    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Monitor Metrics:    │
│ - Guest activation  │
│ - Conversion rate   │
│ - Feature usage     │
└─────────────────────┘
```

## 💾 Storage & Persistence

```
CLIENT SIDE:

localStorage
├─ guestMode: 'true' (if guest)
│  └─ Cleared on signup
│
└─ (Other auth tokens handled by Firebase)

IndexedDB (Firestore offline)
├─ Real user data (persisted for offline)
└─ Guest data: None (no persistence)


FIRESTORE (Cloud):

Collections (ALL user-scoped):
├─ users/{uid}/profile
├─ tasks/{uid}/task1, task2, ...
├─ notes/{uid}/note1, note2, ...
├─ ai-chats/{uid}/message1, ...
├─ friends/{uid}/...
├─ friend-requests/{uid}/...
└─ notifications/{uid}/...

Security:
├─ Authenticated users: Full access to own data
└─ Guests: No access to any collection
```

## 📡 API Request Flow

```
Guest User Makes Request
            │
            ▼
    Is user authenticated?
      │        │
     No       Yes
      │        │
      ▼        ▼
  Return   Check if guest
  Sample    │
  Response  ├─ Guest: Skip API call
   ✅       │  Return sample response
            │
            ├─ Auth: Call API
            │  Return real response
            │
            ▼
         Save to Firestore
         (Auth only)
         ✅
```

---

These diagrams provide visual understanding of:
- Component hierarchy
- Data flow
- Authentication state
- Feature access
- Deployment process
- Storage architecture
