FROM python:3-alpine3.15

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

COPY run_flask.sh .

CMD ["flask", "run", "--host=0.0.0.0"]