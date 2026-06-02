from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))

        for row in result:
            print("Connected Successfully!")
            print(row)

except Exception as e:
    print("Connection Failed!")
    print(e)