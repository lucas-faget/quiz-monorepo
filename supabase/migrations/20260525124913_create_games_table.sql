create table games (
    id uuid primary key default gen_random_uuid(),
    status int default 0,
    current_question_position int default 0,
    current_question_start timestamptz,
    created_at timestamptz default now()
);
