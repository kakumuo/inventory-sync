from flask import Flask
from flask_cors import CORS
from util import formatApiResponse

app = Flask(__name__)
cors = CORS(app)


@app.route("/")
def home():
    return formatApiResponse(0)




