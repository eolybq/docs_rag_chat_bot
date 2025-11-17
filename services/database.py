from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"
engine = create_engine(DATABASE_URL)


def save_embedding(embedding):
    with engine.begin() as conn:
        embedding_vector = embedding["embedding"]
        sql = text("""
            INSERT INTO rag_docs.pandas (main_title, chunk_title, embedding, content)
            VALUES (:main_title, :chunk_title, :embedding, :content)
        """)

        conn.execute(sql, {
            "main_title": embedding["main_title"],
            "chunk_title": embedding["chunk_title"],
            "content": embedding["content"],
            "embedding": embedding_vector
        })


def search_similar(query_embedding, k=5):
    vec_string = "[" + ",".join(map(str, query_embedding)) + "]"
    sql = text("""
        SELECT
            main_title,
            chunk_title,
            content
        FROM rag_docs.pandas
        ORDER BY (embedding <-> :embedding) asc
        LIMIT :k;
    """)

    with engine.begin() as conn:
        rows = conn.execute(sql, {
            "embedding": vec_string,
            "k": k
        }).fetchall()

    rows_out = []
    for row in rows:
        row_dict = {
            "main_title": row[0],
            "chunk_title": row[1],
            "content": row[2]
        }
        rows_out.append(row_dict)

    return rows_out