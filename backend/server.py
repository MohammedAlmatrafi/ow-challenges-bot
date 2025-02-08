from flask import Flask, request, jsonify
from flask_cors import CORS
from database import *
import json

app = Flask(__name__)

# Enable CORS for all origins
CORS(app, origins="*")

# Route to handle /api/challenges?id=<challenge_id>
@app.route('/api/challenges', methods=['GET'])
def serve_challenge():
    # Get the 'id' query parameter from the request
    challenge_id = request.args.get('id')

    # Validate that the 'id' parameter is provided
    if not challenge_id:
        return jsonify({'error': 'Missing required query parameter: id'}), 400

    try:
        # Get challenge details
        (challenge_id, server_id, members_str_json) = get_challenge(challenge_id)
        members = json.loads(members_str_json)
        # Check if a challenge was found
        if challenge_id is None:
            return jsonify({'error': 'Challenge not found'}), 404

        # Convert the result to a dictionary and return as JSON
        return jsonify(members)

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=2000, host="0.0.0.0")