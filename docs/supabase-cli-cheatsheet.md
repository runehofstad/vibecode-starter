# Supabase CLI Cheat Sheet

## Installation & Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize new project
supabase init

# Link to existing project
supabase link --project-ref <project-ref>
```

## Local Development
```bash
# Start local Supabase instance
supabase start

# Stop local instance
supabase stop

# Reset local database
supabase db reset

# Check status
supabase status
```

## Database Operations
```bash
# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase db push

# Pull remote schema changes
supabase db pull

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts

# Seed database
supabase db seed

# Access local database
psql postgresql://postgres:postgres@localhost:54322/postgres
```

## Edge Functions
```bash
# Create new function
supabase functions new <function_name>

# Serve functions locally
supabase functions serve

# Deploy single function
supabase functions deploy <function_name>

# Deploy all functions
supabase functions deploy

# View function logs
supabase functions logs <function_name>

# Set function secrets
supabase secrets set KEY=value
```

## Auth & RLS
```bash
# Generate auth users migration
supabase migration new auth_users

# Test RLS policies locally
supabase test db
```

## Storage
```bash
# Create storage bucket
supabase storage create <bucket_name>

# Upload file
supabase storage cp <local_path> <bucket>/<remote_path>

# Download file
supabase storage cp <bucket>/<remote_path> <local_path>

# List files
supabase storage ls <bucket>/<path>
```

## Project Management
```bash
# List all projects
supabase projects list

# Create new project
supabase projects create <project_name>

# Get project API keys
supabase projects api-keys

# View project settings
supabase projects get <project_ref>
```

## Backup & Restore
```bash
# Create backup
supabase db dump -f backup.sql

# Restore from backup
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql

# Export data as CSV
supabase db dump --data-only -t <table_name> -f data.csv
```

## Useful Patterns

### Quick TypeScript Setup
```bash
# Generate types and save to project
supabase gen types typescript --local > src/types/database.types.ts
```

### Development Workflow
```bash
# 1. Make schema changes
supabase migration new add_user_profiles

# 2. Test locally
supabase db reset

# 3. Generate types
supabase gen types typescript --local > src/types/database.types.ts

# 4. Push to production
supabase db push
```

### Function Development
```bash
# 1. Create function
supabase functions new my-function

# 2. Test locally with hot reload
supabase functions serve my-function

# 3. Deploy when ready
supabase functions deploy my-function

# 4. Monitor in production
supabase functions logs my-function --tail
```