"""
PREZIFY – PYTHON BACKEND REST API & AUDIO STREAMING SERVER
Architecture: Python 3 Standard Library (Zero External Dependencies Required)
Run: python backend/server.py
"""

import http.server
import socketserver
import json
import os
import urllib.parse
import mimetypes

PORT = int(os.environ.get('PORT', 5000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')
ROOT_DIR = os.path.join(BASE_DIR, '..')

def read_json(filename):
    file_path = os.path.join(DATA_DIR, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def write_json(filename, data):
    file_path = os.path.join(DATA_DIR, filename)
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing {filename}: {e}")
        return False

class PreZifyRequestHandler(http.server.BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization')
        self.send_header('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        print(f"[GET] {pathname}")

        # API: Songs List
        if pathname == '/api/songs':
            songs = read_json('songs.json')
            self.send_json_response(200, {'success': True, 'count': len(songs), 'data': songs})
            return

        # API: Single Song
        if pathname.startswith('/api/songs/') and not pathname.endswith('/stream'):
            song_id = pathname.split('/')[-1]
            songs = read_json('songs.json')
            song = next((s for s in songs if s.get('id') == song_id), None)
            if song:
                self.send_json_response(200, {'success': True, 'data': song})
            else:
                self.send_json_response(404, {'success': False, 'error': 'Song not found'})
            return

        # API: Audio Stream (HTTP 206 Partial Content)
        if pathname.startswith('/api/songs/') and pathname.endswith('/stream'):
            parts = pathname.split('/')
            song_id = parts[3]
            songs = read_json('songs.json')
            song = next((s for s in songs if s.get('id') == song_id), None)
            if song and 'audioSrc' in song:
                self.stream_audio(song['audioSrc'])
            else:
                self.send_json_response(404, {'success': False, 'error': 'Audio file not found'})
            return

        # API: Playlists
        if pathname == '/api/playlists':
            playlists = read_json('playlists.json')
            self.send_json_response(200, {'success': True, 'count': len(playlists), 'data': playlists})
            return

        # API: Artists
        if pathname == '/api/artists':
            artists = read_json('artists.json')
            self.send_json_response(200, {'success': True, 'count': len(artists), 'data': artists})
            return

        # API: Search
        if pathname == '/api/search':
            q = query.get('q', [''])[0].strip().lower()
            songs = read_json('songs.json')
            artists = read_json('artists.json')
            playlists = read_json('playlists.json')

            matched_songs = [s for s in songs if q in s.get('title','').lower() or q in s.get('artist','').lower() or q in s.get('genre','').lower()]
            matched_artists = [a for a in artists if q in a.get('name','').lower()]
            matched_playlists = [p for p in playlists if q in p.get('title','').lower() or q in p.get('desc','').lower()]

            self.send_json_response(200, {
                'success': True,
                'query': q,
                'results': {
                    'songs': matched_songs,
                    'artists': matched_artists,
                    'playlists': matched_playlists
                }
            })
            return

        # Static Frontend Files
        req_path = '/index.html' if pathname == '/' else pathname
        req_path = req_path.lstrip('/')
        file_path = os.path.join(FRONTEND_DIR, req_path)
        if not os.path.exists(file_path):
            file_path = os.path.join(ROOT_DIR, req_path)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            mime_type = mime_type or 'application/octet-stream'

            if file_path.endswith('.mp3'):
                self.stream_audio(os.path.relpath(file_path, FRONTEND_DIR))
                return

            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', mime_type)
            self.send_header('Content-Length', str(os.path.getsize(file_path)))
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"404 Not Found - PreZify Server")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path

        # Read JSON body
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        try:
            body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}
        except:
            body = {}

        if pathname == '/api/playlists':
            if not body.get('title'):
                self.send_json_response(400, {'success': False, 'error': 'Title required'})
                return
            playlists = read_json('playlists.json')
            new_pl = {
                'id': f"pl-{int(os.times().system * 1000)}",
                'title': body.get('title'),
                'desc': body.get('desc', 'Custom user playlist'),
                'cover': body.get('cover', 'images/cover1.jpg'),
                'creator': body.get('creator', 'PreZify User'),
                'trackIds': body.get('trackIds', [])
            }
            playlists.append(new_pl)
            write_json('playlists.json', playlists)
            self.send_json_response(201, {'success': True, 'data': new_pl})
            return

        self.send_json_response(404, {'success': False, 'error': 'Endpoint not found'})

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_cors_headers()
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def stream_audio(self, audio_rel_path):
        audio_path = os.path.join(FRONTEND_DIR, audio_rel_path)
        if not os.path.exists(audio_path):
            audio_path = os.path.join(ROOT_DIR, audio_rel_path)

        if not os.path.exists(audio_path):
            self.send_json_response(404, {'success': False, 'error': 'Audio file missing'})
            return

        file_size = os.path.getsize(audio_path)
        range_header = self.headers.get('Range')

        if range_header:
            range_val = range_header.replace('bytes=', '')
            parts = range_val.split('-')
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if len(parts) > 1 and parts[1] else file_size - 1
            chunk_length = (end - start) + 1

            self.send_response(206)
            self.send_cors_headers()
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Range', f"bytes {start}-{end}/{file_size}")
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Length', str(chunk_length))
            self.end_headers()

            with open(audio_path, 'rb') as f:
                f.seek(start)
                self.wfile.write(f.read(chunk_length))
        else:
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Length', str(file_size))
            self.end_headers()
            with open(audio_path, 'rb') as f:
                self.wfile.write(f.read())

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), PreZifyRequestHandler) as httpd:
        print(f"PreZify Python Backend running at http://localhost:{PORT}")
        httpd.serve_forever()

