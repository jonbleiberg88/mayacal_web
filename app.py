from flask import Flask
import mayacal as mc

app = Flask(__name__)

api_route = '/api/v1/'

@app.route(f'{api_route}infer', methods=['POST'])
def infer():
    return

@app.route(f'{api_route}convert/from_maya', methods=['POST'])
def convert_from_maya():
    return


@app.route(f'{api_route}convert/to_maya', methods=['POST'])
def convert_to_maya():
    return
