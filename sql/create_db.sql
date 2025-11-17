CREATE TABLE IF NOT EXIST rag_docs.pandas (
    id SERIAL PRIMARY KEY,
    main_title TEXT NOT NULL,
    chunk_title TEXT NOT NULL,
    content TEXT,
    embedding extensions.vector(4096)
);
