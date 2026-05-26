create table players (
    id uuid primary key default gen_random_uuid(),
    game_id uuid references games(id) on delete cascade,
    name text not null,
    score int default 0,
    is_host boolean default false,
    created_at timestamp default now()
);
