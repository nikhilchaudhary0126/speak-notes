import os
import psycopg2

from flask import make_response
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import six
from google.cloud import translate_v2 as translate

load_dotenv()

app = Flask(__name__)
CORS(app)


def connect():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    return conn


def initialize():
    conn = connect()
    with conn.cursor() as cur:
        cur.execute("CREATE TABLE IF NOT EXISTS users(uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),email VARCHAR(50) "
                    "UNIQUE, password VARCHAR(50), name VARCHAR(50));")
        cur.execute("CREATE TABLE IF NOT EXISTS notes(nid UUID PRIMARY KEY DEFAULT gen_random_uuid(), uid UUID, "
                    "title VARCHAR(50),note VARCHAR(500));")
        conn.commit()


def create_note(uid, note, title):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO notes(uid,note,title) values('%s','%s', '%s');" % (uid, note, title))
            conn.commit()
            return True
    except Exception:
        return False


def get_note(uid):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT nid,title,note from notes where uid='%s';" % uid)
            res = cur.fetchall()
        return res
    except Exception:
        return []


def delete_note(nid):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM notes WHERE nid='%s';" % nid)
            conn.commit()
            return True
    except Exception:
        return False


def update_note(nid, note):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("UPDATE notes SET note='%s' WHERE nid='%s';" % (note, nid))
            conn.commit()
            return True
    except Exception:
        return False


def create_user(email, password, name):
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users(email,password,name) values('%s','%s','%s');" % (email, password, name))
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


@app.route('/get_notes/<string:uid>')
def note_getter(uid):
    if uid and uid != '':
        notes = get_note(uid)
        if notes:
            return make_response(jsonify({'notes': notes}), 200)
        else:
            return make_response(jsonify({'notes': []}), 200)
    return make_response(jsonify({}), 400)


@app.route('/update_note', methods=['POST'])
def note_updater():
    if request.json and 'nid' in request.json and request.json['nid'] != '' and 'note' in request.json and \
            request.json['note'] != '':
        if update_note(request.json['nid'], request.json['note']):
            return make_response(jsonify({'message': 'Note updated'}), 200)
    return make_response(jsonify({'notes': []}), 200)


@app.route('/create_note', methods=['POST'])
def note_creator():
    if request.json and 'uid' in request.json and request.json['uid'] != '' and 'note' in request.json and \
            request.json['note'] != '' and 'title' in request.json and request.json['title'] != '':
        if create_note(request.json['uid'], request.json['note'], request.json['title']):
            notes = get_note(request.json['uid'])
            return make_response(jsonify({'message': 'Note created', 'notes': notes}), 200)
    return make_response(jsonify({'notes': []}), 200)


@app.route('/convert_note', methods=['POST'])
def note_convertor():
    if request.json and 'note' in request.json and request.json['note'] != '' and 'target' in request.json and \
            request.json['target'] != '':

        translate_client = translate.Client()
        text = request.json['note']
        target = request.json['target']

        if isinstance(text, six.binary_type):
            text = text.decode("utf-8")
        result = translate_client.translate(text, target_language=target)
        return make_response(jsonify({'message': 'Note coverted', 'note': result["translatedText"]}), 200)
    return make_response(jsonify({'notes': []}), 200)


@app.route('/delete_note/<string:nid>', methods=["DELETE"])
def note_deleter(nid):
    if nid and nid != '':
        if delete_note(nid):
            return make_response(jsonify({'message': 'Note deleted'}), 200)
    return make_response(jsonify({}), 400)


@app.route('/login', methods=['POST'])
def login():
    if request.json and 'email' in request.json and request.json['email'] != '' and 'password' in request.json \
            and request.json['password'] != '':
        uid = authenticate(request.json['email'], request.json['password'])
        if uid:
            return make_response(jsonify({'message': 'Login successful', 'uid': uid}), 200)
    return make_response(jsonify({}), 400)


@app.route('/register', methods=['POST'])
def register():
    if request.json and 'email' in request.json and 'name' in request.json and 'password' in request.json and \
            request.json['name'] != '' and request.json['email'] != '' and request.json['password'] != '':
        if create_user(request.json['email'], request.json['name'], request.json['password']):
            return make_response(jsonify({'message': 'User created'}), 200)
    return make_response(jsonify({}), 400)


if __name__ == '__main__':
    initialize()
    app.run(host="localhost", port=5000, debug=True)
