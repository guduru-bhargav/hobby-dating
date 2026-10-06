-- ==========================================================================
-- Discover (like / pass + matches) and one-to-one chat fixes.
-- Run in the Supabase SQL editor. Review first; each step is safe to re-run.
-- ==========================================================================

-- 1) Likes and passes. Drives the Discover deck and match detection.
create table if not exists public.swipes (
  id          bigint generated always as identity primary key,
  from_user   uuid not null references auth.users (id) on delete cascade,
  to_user     uuid not null references auth.users (id) on delete cascade,
  action      text not null check (action in ('like', 'pass')),
  created_at  timestamptz not null default now(),
  constraint swipes_one_per_pair unique (from_user, to_user),
  constraint swipes_not_self check (from_user <> to_user)
);

alter table public.swipes enable row level security;

drop policy if exists "swipes: insert own" on public.swipes;
create policy "swipes: insert own"
  on public.swipes for insert to authenticated
  with check (from_user = auth.uid());

drop policy if exists "swipes: update own" on public.swipes;
create policy "swipes: update own"
  on public.swipes for update to authenticated
  using (from_user = auth.uid())
  with check (from_user = auth.uid());

-- You can read your own swipes, and see that someone liked you.
-- Passes are never visible to the person passed on.
drop policy if exists "swipes: read own or likes to me" on public.swipes;
create policy "swipes: read own or likes to me"
  on public.swipes for select to authenticated
  using (from_user = auth.uid() or (to_user = auth.uid() and action = 'like'));

-- 2) Conversations: last-message preview columns, and one conversation per pair.
alter table public.conversations
  add column if not exists last_message text,
  add column if not exists last_message_at timestamptz;

-- If this fails, there are duplicate conversations for the same pair. Find them with:
--   select least(user1, user2), greatest(user1, user2), count(*)
--   from public.conversations group by 1, 2 having count(*) > 1;
-- Merge or delete the extras, then run this again.
create unique index if not exists conversations_one_per_pair
  on public.conversations (least(user1, user2), greatest(user1, user2));

-- 3) Notifications should point at the conversation they came from (used to clear unread badges).
alter table public.notifications
  add column if not exists conversation_id uuid references public.conversations (id) on delete cascade;

-- 4) Realtime: the app listens for new messages, conversation updates, notifications and swipes.
do $$
declare
  t text;
begin
  foreach t in array array['messages', 'conversations', 'notifications', 'swipes'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- 5) Check these before you rely on chat (not changed here, because existing policies are not in the repo):
--   * messages: a user can insert only where sender_id = auth.uid() and they are user1 or user2 of the conversation
--   * messages / conversations: a user can select only rows of conversations they are part of
--   * conversations: a user can update only conversations they are part of (last_message is written by the sender)
--   * notifications: a user can update their own rows (is_read)
--   * profiles: any signed-in user can read profiles (needed for Discover and the inbox)
