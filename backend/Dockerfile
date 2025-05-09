FROM python:3.9-slim

WORKDIR /src

COPY . .

RUN pip install -r requirements.txt
RUN pip install gunicorn

RUN mkdir -p /src/instance && chown -R 1000:1000 /src/instance
USER 1000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "--timeout", "120", "app:app"]
