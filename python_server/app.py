from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def do_nothing():
    return jsonify({"message": "Did nothing!"}), 200




@app.route('/api/comparison', methods=['POST'])
def compare():
    # this is where we will use LlamaIndex to generate feature lists, SWOTs, etc
    data = request.json
    return jsonify({"message": "Compare!"}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=8080)
