from flask import Flask,request
from flask import jsonify
from flask_cors import CORS,cross_origin
import sys
from binascii import hexlify

app = Flask(__name__)

CORS(app, resources={r'/uploads/*':{"origins": "*"}})

@app.route("/")
def status():
    return jsonify({"status":200})

def check_endianess():
    if (sys.byteorder == "little"):
        return False
    else:
        return True

@app.route("/upload", methods=["POST","OPTIONS"])
@cross_origin()
def upload():
    if request.method == "POST":
        file = request.files.get("file")
        file_content = file.read()
        # print(file_content)
        if(check_endianess()):
            pass
        else:
            # print(hexlify(file_content))
            hexcode = hexlify(file_content)
            # good read and room for improvement
            # https://divan.dev/posts/animatedqr/
             
        if file_content:
            return jsonify({"status":200})
        else:
            return jsonify({"status":500})

