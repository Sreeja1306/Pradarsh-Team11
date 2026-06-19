from pydantic import BaseModel
from typing import List, Optional


class UploadResponse(BaseModel):
    url: str
    path: str
    filename: str


class MultiUploadResponse(BaseModel):
    urls: List[str]
    paths: List[str]
    count: int
