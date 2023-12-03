from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route("/")
def status():
    return jsonify({"status":200})

