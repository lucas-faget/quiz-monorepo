create table games (
    id uuid primary key default gen_random_uuid(),
    status int default 0,
    current_question_position int default 0,
    current_question_start timestamp,
    created_at timestamp default now()
);
