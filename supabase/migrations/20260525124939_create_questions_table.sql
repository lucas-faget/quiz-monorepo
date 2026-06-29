create table questions (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    answer text not null,
    accepted_answers jsonb not null,
    created_at timestamptz default now()
);
