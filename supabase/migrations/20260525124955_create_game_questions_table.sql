create table game_questions (
    id uuid primary key default gen_random_uuid(),
    game_id uuid references games(id) on delete cascade,
    question_id uuid references questions(id),
    position int not null
);
