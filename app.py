from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from services.gemini_service import get_ai_results

app = Flask(__name__)

CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():

    try:

        data = request.json

        category = data.get('category')
        sector = data.get('sector')
        role = data.get('role')
        filters = data.get('filters')
        page = data.get('page')

        results = get_ai_results(
            category=category,
            sector=sector,
            role=role,
            filters=filters,
            page=page
        )

        return jsonify(results)

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

if __name__ == '__main__':

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )
