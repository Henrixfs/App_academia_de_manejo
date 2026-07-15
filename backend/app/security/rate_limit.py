from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    def __init__(self, requests: int, window_seconds: int = 60):
        self.requests = requests
        self.window_seconds = window_seconds
        self._entries: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    async def __call__(self, request: Request) -> None:
        client_host = request.client.host if request.client else "unknown"
        key = client_host
        now = monotonic()
        with self._lock:
            entries = self._entries[key]
            while entries and now - entries[0] >= self.window_seconds:
                entries.popleft()
            if len(entries) >= self.requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Demasiados intentos. Intenta nuevamente en un minuto",
                )
            entries.append(now)
