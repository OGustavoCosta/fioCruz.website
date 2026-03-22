import json
import os

from flask import Flask, render_template, jsonify

app = Flask(__name__)


def load_dashboard_data():
    path = os.path.join(os.path.dirname(__file__), 'data', 'dashboard.json')
    with open(path, encoding='utf-8') as f:
        return json.load(f)


@app.route('/painel-de-indicadores')
def indicators_dashboard():
    return render_template('pages/indicators_dashboard.html')


@app.route('/biblioteca')
def library():
    return render_template('pages/library.html')


@app.route('/publicacoes')
def publications():
    return render_template('pages/publications.html')


@app.route('/sobre')
def about():
    return render_template('pages/about.html')


@app.route('/api/dashboard')
def api_dashboard():
    with open("data/mapa_leaflet.geojson", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)


@app.route('/')
def data_dashboard():
    return render_template('pages/data_dashboard.html')


@app.route("/geojson")
def geojson():
    with open("data/mapa_leaflet.geojson", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
