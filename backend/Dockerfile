FROM python:3.12-slim

WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Comando para correr
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]