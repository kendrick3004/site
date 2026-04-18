from flask import Flask, render_template, request, send_file

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

@app.route('/favicon.ico')
def favicon():
    return send_file('assets/DEVS/favicon/Favicon.ico', mimetype='image/x-icon')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
