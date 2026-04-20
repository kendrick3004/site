from flask import Flask, render_template, request, send_file
import sys
import datetime

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

visitas_total = 0
visitas_hoje = 0
data_atual = datetime.date.today()


def atualizar_linha():
    # linha fixa no final
    sys.stdout.write(f"\r📊 Visitas Total: {visitas_total} | Hoje: {visitas_hoje}")
    sys.stdout.flush()


@app.before_request
def contar_visita():
    global visitas_total, visitas_hoje, data_atual

    # ignora arquivos estáticos
    if request.path.startswith(('/assets', '/css', '/js', '/img', '/favicon.ico')):
        return

    hoje = datetime.date.today()

    # reset diário
    if hoje != data_atual:
        visitas_hoje = 0
        data_atual = hoje

    visitas_total += 1
    visitas_hoje += 1

    atualizar_linha()


@app.route('/favicon.ico')
def favicon():
    return send_file('assets/DEVS/favicon/Favicon.ico', mimetype='image/x-icon')


@app.route('/<path:path>/favicon.ico')
def favicon_nested(path):
    return send_file('assets/DEVS/favicon/Favicon.ico', mimetype='image/x-icon')


@app.route('/')
def index():
    return render_template('index.html')


# 🔥 captura erros e mostra no log
@app.errorhandler(Exception)
def erro(e):
    print(f"\n❌ ERRO: {str(e)}")
    atualizar_linha()
    return "Erro interno", 500


if __name__ == '__main__':
    print("🚀 Servidor iniciando...")
    atualizar_linha()
    app.run(host="0.0.0.0", port=5000, debug=False)