from flask import Flask, request, jsonify, render_template
import mayacal as mc

app = Flask(__name__)

api_route = '/api/v1/'

@app.route('/')
def index():
    render_template('index.html')


@app.route(f'{api_route}infer', methods=['POST'])
def infer():
    req_json = request.get_json()

    try:
        date = mc.mayadate.from_dict(req_json)
        poss_dates = date.infer_mayadates()
        poss_dates = [d.to_dict for d in poss_dates]
        response_dict = {
            'status' : "success",
            'data' : {'poss_dates' : poss_dates}}

    except:
        response_dict = {
            'status' : "error",
            'message' : "Unable to infer date components"
        }

    return jsonify(response_dict)

@app.route(f'{api_route}convert/from_maya', methods=['POST'])
def convert_from_maya():
    return


@app.route(f'{api_route}convert/to_maya', methods=['POST'])
def convert_to_maya():
    return
