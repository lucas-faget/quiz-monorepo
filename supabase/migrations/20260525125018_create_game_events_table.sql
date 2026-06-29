create table game_events (
    id uuid primary key default gen_random_uuid(),
    game_id uuid references games(id) on delete cascade,
    type text not null,
    payload jsonb,
    created_at timestamptz default now()
);
