import os
import psycopg2

from flask import make_response
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


def connect():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    return conn


def initialize():
    conn = connect()
    with conn.cursor() as cur:
        cur.execute(
            "CREATE TABLE IF NOT EXISTS users(uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),email VARCHAR(50) "
            "UNIQUE, password VARCHAR(50), name VARCHAR(50));")
        conn.commit()


def create_user(email, password, name):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users values('%s','%s','%s');" % (email, password, name))
            conn.commit()
            return True
    except Exception:
        return False


def authenticate(email, password):
    """
    Not the best way of authentication, using for convenience
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT uid FROM users WHERE email = '%s' AND password = '%s';" % (email, password))
            res = cur.fetchone()[0]
        return res
    except Exception:
        return 0


@app.route('/login', methods=['POST'])
def login():
    if request.json and 'email' in request.json and request.json['email'] != '' and 'password' in request.json \
            and request.json['password'] != '':
        uid = authenticate(request.json['email'], request.json['password'])
        if uid:
            return make_response(jsonify({'message': 'Login successful'}), 200)
    return make_response(jsonify({}), 400)


@app.route('/register', methods=['POST'])
def register():
    if request.json and 'email' in request.json and 'name' in request.json and 'password' not in request.json and \
            request.json['name'] != '' and request.json['email'] != '' and request.json['password'] != '':
        if create_user(request.json['email'], request.json['name'], request.json['password']):
            return make_response(jsonify({'message': 'User created'}), 200)
    return make_response(jsonify({'message': 'Please enter all attributes'}), 400)


if __name__ == '__main__':
    initialize()
    app.run(host="localhost", port=5000, debug=True)
