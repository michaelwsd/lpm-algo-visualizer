from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from algorithms.z_algorithm import z_algorithm
from algorithms.boyer_moore import BoyerMoore

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lpm-algo-visual.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatternInput(BaseModel):
    text: str 
    pattern: str 

@app.post('/run/z-algo')
def fetch_z_algorithm(data: PatternInput):
    txt, pat = data.text, data.pattern
    return z_algorithm(txt, pat)

@app.post('/run/boyer-moore')
def fetch_boyer_moore(data: PatternInput):
    txt, pat = data.text, data.pattern
    bm = BoyerMoore(pat)
    return bm.pattern_match(txt)