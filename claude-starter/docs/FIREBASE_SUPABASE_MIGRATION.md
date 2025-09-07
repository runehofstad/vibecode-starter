# Firebase ↔ Supabase Migration Guide

## Overview
This guide provides step-by-step instructions for migrating between Firebase and Supabase, including data migration, code refactoring, and feature parity strategies.

## Firebase → Supabase Migration

### Phase 1: Planning & Setup

#### 1. Analyze Current Firebase Usage
```bash
# Use analysis agent to audit Firebase usage
claude --agent docs/agents/data-agent.md "Analyze Firebase project and list all services in use"
```

Typical Firebase services to migrate:
- Firestore → PostgreSQL
- Firebase Auth → Supabase Auth
- Cloud Functions → Edge Functions
- Firebase Storage → Supabase Storage
- FCM → Web Push API / OneSignal
- Analytics → PostHog / Plausible

#### 2. Setup Supabase Project
```bash
# Initialize Supabase
npx supabase init
npx supabase start  # Local development

# Or create cloud project
# Visit: https://app.supabase.com
```

### Phase 2: Data Model Transformation

#### Firestore to PostgreSQL Schema

**Firestore Structure:**
```javascript
// NoSQL document structure
users/
  userId/
    profile: { name, email, avatar }
    posts/
      postId: { title, content, likes }
```

**PostgreSQL Schema:**
```sql
-- Relational structure
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### Data Migration Script
```typescript
// migrate-firestore-to-supabase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateUsers() {
  const usersSnapshot = await getDocs(collection(firestore, 'users'));
  const users = [];
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    const postsSnapshot = await getDocs(
      collection(firestore, `users/${doc.id}/posts`)
    );
    
    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: doc.id, // Preserve Firebase UID
        email: userData.email,
        name: userData.profile?.name,
        avatar: userData.profile?.avatar,
        created_at: userData.createdAt?.toDate()
      })
      .select()
      .single();
    
    if (error) {
      console.error('User migration error:', error);
      continue;
    }
    
    // Insert user's posts
    const posts = postsSnapshot.docs.map(postDoc => ({
      id: postDoc.id,
      user_id: user.id,
      title: postDoc.data().title,
      content: postDoc.data().content,
      likes: postDoc.data().likes || 0,
      created_at: postDoc.data().createdAt?.toDate()
    }));
    
    if (posts.length > 0) {
      const { error: postsError } = await supabase
        .from('posts')
        .insert(posts);
      
      if (postsError) {
        console.error('Posts migration error:', postsError);
      }
    }
  }
  
  console.log('Migration completed');
}
```

### Phase 3: Authentication Migration

#### Firebase Auth to Supabase Auth

**Export Firebase Users:**
```bash
# Export users from Firebase
firebase auth:export users.json --format=json
```

**Import to Supabase:**
```typescript
// import-auth-users.ts
import { createClient } from '@supabase/supabase-js';
import users from './users.json';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importUsers() {
  for (const user of users.users) {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      user_metadata: {
        firebase_uid: user.localId,
        display_name: user.displayName,
        photo_url: user.photoUrl
      }
    });
    
    if (error) {
      console.error('Import error:', error);
    }
  }
}
```

### Phase 4: Function Migration

#### Cloud Functions to Edge Functions

**Firebase Cloud Function:**
```typescript
// Firebase
export const processOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated');
  }
  
  const order = await processPayment(data);
  await admin.firestore().collection('orders').add(order);
  
  return { success: true, orderId: order.id };
});
```

**Supabase Edge Function:**
```typescript
// Supabase
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { data } = await req.json();
  const order = await processPayment(data);
  
  await supabase.from('orders').insert(order);
  
  return new Response(
    JSON.stringify({ success: true, orderId: order.id }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

### Phase 5: Storage Migration

```typescript
// migrate-storage.ts
import { getStorage, ref, listAll, getDownloadURL, getBytes } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';

async function migrateStorage() {
  const firebaseStorage = getStorage();
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // List all files in Firebase Storage
  const listRef = ref(firebaseStorage, '/');
  const res = await listAll(listRef);
  
  for (const itemRef of res.items) {
    // Download from Firebase
    const url = await getDownloadURL(itemRef);
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Upload to Supabase
    const { error } = await supabase.storage
      .from('files')
      .upload(itemRef.fullPath, blob);
    
    if (error) {
      console.error('Storage migration error:', error);
    }
  }
}
```

## Supabase → Firebase Migration

### Phase 1: Setup Firebase Project

```bash
# Initialize Firebase
npm install -g firebase-tools
firebase init

# Select services:
# - Firestore
# - Functions
# - Storage
# - Hosting
```

### Phase 2: Data Model Transformation

#### PostgreSQL to Firestore

**PostgreSQL Relations:**
```sql
-- Relational data with JOINs
SELECT 
  p.*, 
  u.name as author_name,
  COUNT(c.id) as comment_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id, u.name;
```

**Firestore Denormalized:**
```javascript
// Denormalized document structure
{
  posts: {
    postId: {
      title: "Post Title",
      content: "Content",
      authorId: "userId",
      authorName: "John Doe", // Denormalized
      commentCount: 5,        // Denormalized
      createdAt: Timestamp
    }
  }
}
```

#### Migration Script
```typescript
// migrate-supabase-to-firestore.ts
import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

const supabase = createClient(supabaseUrl, supabaseKey);
const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);

async function migratePosts() {
  // Fetch relational data
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!user_id(name, email),
      comments(count)
    `);
  
  const batch = writeBatch(firestore);
  
  for (const post of posts) {
    const postRef = doc(firestore, 'posts', post.id);
    
    // Denormalize data for Firestore
    batch.set(postRef, {
      title: post.title,
      content: post.content,
      authorId: post.user_id,
      authorName: post.user.name,      // Denormalized
      authorEmail: post.user.email,    // Denormalized
      commentCount: post.comments[0].count, // Denormalized
      createdAt: new Date(post.created_at)
    });
  }
  
  await batch.commit();
}
```

### Phase 3: Code Refactoring

#### Update Queries

**Supabase Query:**
```typescript
// SQL-based query
const { data } = await supabase
  .from('posts')
  .select('*, users(name)')
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10);
```

**Firebase Query:**
```typescript
// NoSQL query
const q = query(
  collection(firestore, 'posts'),
  where('published', '==', true),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const snapshot = await getDocs(q);
const data = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

#### Update Real-time Subscriptions

**Supabase Real-time:**
```typescript
// PostgreSQL changes
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Change:', payload);
    }
  )
  .subscribe();
```

**Firebase Real-time:**
```typescript
// Firestore listeners
const unsubscribe = onSnapshot(
  collection(firestore, 'posts'),
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log('Change:', change.type, change.doc.data());
    });
  }
);
```

## Migration Checklist

### Pre-Migration
- [ ] Backup all data
- [ ] Document current architecture
- [ ] List all dependencies
- [ ] Create migration timeline
- [ ] Set up staging environment
- [ ] Prepare rollback plan

### During Migration
- [ ] Migrate authentication users
- [ ] Transform and migrate data
- [ ] Update security rules/policies
- [ ] Migrate serverless functions
- [ ] Transfer storage files
- [ ] Update environment variables
- [ ] Refactor application code
- [ ] Update API endpoints

### Post-Migration
- [ ] Run comprehensive tests
- [ ] Verify data integrity
- [ ] Check performance metrics
- [ ] Update documentation
- [ ] Monitor error logs
- [ ] Gradual rollout (if possible)
- [ ] Decommission old services

## Common Pitfalls & Solutions

### 1. Data Consistency
**Problem:** Maintaining consistency during migration
**Solution:** Use dual-write pattern during transition

```typescript
// Dual-write during migration
async function createPost(data) {
  // Write to both systems
  const [supabaseResult, firebaseResult] = await Promise.all([
    supabase.from('posts').insert(data),
    addDoc(collection(firestore, 'posts'), data)
  ]);
  
  return { supabase: supabaseResult, firebase: firebaseResult };
}
```

### 2. Authentication State
**Problem:** Users need to re-authenticate
**Solution:** Implement SSO or token exchange

### 3. File URLs
**Problem:** Storage URLs change
**Solution:** Implement URL mapping service

```typescript
// URL mapping service
function mapStorageUrl(oldUrl: string): string {
  if (oldUrl.includes('firebasestorage.googleapis.com')) {
    // Extract path and map to Supabase
    const path = extractPath(oldUrl);
    return `${supabaseUrl}/storage/v1/object/public/files/${path}`;
  }
  return oldUrl;
}
```

## Gradual Migration Strategy

### Blue-Green Deployment
```yaml
week_1:
  - Setup new backend
  - Implement dual-write
  - Start data sync

week_2:
  - Migrate read operations (10% traffic)
  - Monitor performance
  - Fix issues

week_3:
  - Increase traffic (50%)
  - Migrate write operations
  - Continue monitoring

week_4:
  - Full migration (100%)
  - Remove dual-write
  - Decommission old backend
```

## Tools & Resources

### Migration Tools
- **Supabase Migration Tool**: Built-in migration assistant
- **Firebase Export Tools**: firebase-tools CLI
- **Data Transformation**: Custom scripts with TypeScript
- **Testing**: Jest, Playwright for E2E

### Useful Commands
```bash
# Export Firebase data
firebase firestore:export gs://backup-bucket

# Import to Supabase
psql postgresql://[connection-string] < import.sql

# Sync real-time
node sync-realtime.js --source=firebase --target=supabase
```

## Support & Help

When migrating, use specialized agents:
```bash
# For complex migrations
claude --orchestrate "Migrate production Firebase app to Supabase with zero downtime"

# For specific issues
claude --agent docs/agents/backend-agent.md "Help debug Supabase RLS policies after Firebase migration"
```
