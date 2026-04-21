from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

visitas = 0

@app.before_request
def log_request():
    global visitas
    visitas += 1
    print(f"🚧 MANUTENÇÃO | Visitas: {visitas}")


# página principal
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


# arquivos estáticos
@app.route('/<path:path>')
def static_files(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')


if __name__ == '__main__':
    print("🚧 Servidor de manutenção iniciado na porta 5000")
    app.run(host="0.0.0.0", port=5000, debug=False)