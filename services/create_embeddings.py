from openai import OpenAI
from dotenv import load_dotenv
import os
from tqdm import tqdm

from services.preprocess import get_pages
from services.database import save_embedding

load_dotenv()
IPADRESS = os.getenv("ipadress")
client = OpenAI(base_url=IPADRESS, api_key="lm-studio")

def convert_embedding(content):
    response = client.embeddings.create(
        model="text-embedding-qwen3-embedding-8b",
        input=content,
        timeout=60
    )
    return response.data[0].embedding


def get_embedding(path):
    # Prevod kazdeho chunk na embedding
    pages_list = get_pages(path)


    # for page in pages_list:
    for page in tqdm(pages_list, desc="Pages"):
        # for chunk in page["chunks"]:
        for chunk in tqdm(page["chunks"], desc="Chunks", leave=False):
            embedding_vector = convert_embedding(chunk["content"])
            # dim vektoru: (4096)
            embedding = {
                "embedding": embedding_vector,
                "content": chunk["content"],
                "main_title": page["main_title"],
                "chunk_title": chunk["title"]
            }
            save_embedding(embedding)