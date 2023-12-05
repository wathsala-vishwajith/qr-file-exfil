from flask import Flask,request,send_file
from flask import jsonify
import os
from flask_cors import CORS,cross_origin
import sys
from binascii import hexlify
import segno
import io

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

        if file_content:
        
            #get the length
            file.seek(0,os.SEEK_SET)
            file_length = file.seek(0,os.SEEK_END)
            print(file_length)
            file.seek(0,os.SEEK_SET) #return to the beggining 

            buff = io.BytesIO()

            # print(file_content)
        
            if(check_endianess()):
                pass
            else:
                # print(hexlify(file_content))
                # hexcode = hexlify(file_content)
                # good read and room for improvement
                # https://divan.dev/posts/animatedqr/

                #Version 1, Error Correction Level L (Low):
                #   Data Capacity: Approximately 17 bytes
                # 
                # Version 10, Error Correction Level M (Medium):
                #   Data Capacity: Approximately 700 bytes

                # Version 20, Error Correction Level Q (Quartile):
                #   Data Capacity: Approximately 2,400 bytes

                # Version 40, Error Correction Level H (High):
                #   Data Capacity: Approximately 29,000 bytes

                # return jsonify({"status":200})    
                if(file_length < 25000):
                    qr = segno.make(file_content, version=40, error='H')
                    qr.save(buff,kind='png')
                    buff.seek(0)
                    return send_file(buff,mimetype='image/png')
        else:
             return jsonify({"status":500})    
        
           

