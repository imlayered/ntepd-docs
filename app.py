from flask import Flask, request, jsonify
import os
import json
from datetime import datetime, UTC

app = Flask(__name__, static_url_path='')

NOTES_DIR = 'notes'
if not os.path.exists(NOTES_DIR):
   os.makedirs(NOTES_DIR)

@app.route('/')
def serve_static():
   return app.send_static_file('index.html')

@app.route('/api/notes', methods=['GET'])
def get_notes():
   notes = []
   for filename in os.listdir(NOTES_DIR):
       if filename.endswith('.json'):
           with open(os.path.join(NOTES_DIR, filename)) as f:
               note = json.load(f)
               notes.append(note)
   return jsonify(sorted(notes, key=lambda x: x['created_at'], reverse=True))

if __name__ == '__main__':
   app.run(debug=True, port=5000)