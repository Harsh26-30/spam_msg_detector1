import joblib

from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
CORS(app)

MODEL_DIR = Path(__file__).resolve().parent
classifier_tfidf = joblib.load(MODEL_DIR / "tfidf_spammsg_vectorizer.pkl")
model_spam_msg_dectector = joblib.load(MODEL_DIR / "spam_msg_detector_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
	data = request.get_json(silent=True) or {}
	message = data.get("message", data.get("text"))

	if not isinstance(message, str) or not message.strip():
		return jsonify({"error": "A non-empty 'message' string is required."}), 400

	features = classifier_tfidf.transform([message])
	prediction = model_spam_msg_dectector.predict(features)[0]

	return jsonify({"prediction": str(prediction)})


if __name__ == "__main__":
    app.run(debug=True, port=5000)