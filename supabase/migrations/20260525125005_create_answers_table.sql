create table answers (
    id uuid primary key default gen_random_uuid(),
    game_id uuid references games(id) on delete cascade,
    player_id uuid references players(id) on delete cascade,
    question_id uuid references questions(id),
    answer text not null,
    is_correct boolean default false,
    created_at timestamp default now()
);
