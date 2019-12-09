from flask import Flask, request, jsonify, render_template
import mayacal as mc
import sys

app = Flask(__name__)

api_route = '/api/v1/'

@app.route('/')
def index():
    return render_template("index.html")


@app.route(f'{api_route}infer', methods=['POST'])
def infer():
    req_json = request.get_json()
    print(req_json, file=sys.stderr)

    try:
        date = mc.mayadate.from_dict(req_json)
        poss_dates = date.infer_mayadates()

        poss_dates = [d.to_dict() for d in poss_dates]
        response_dict = {
            'success' : True,
            'data' : {'poss_dates' : poss_dates}}

    except:
        response_dict = {
            'success' : False,
            'message' : "Unable to infer date components"
        }

    return jsonify(response_dict)


@app.route(f'{api_route}convert/from_maya', methods=['POST'])
def convert_from_maya():
    req_json = request.get_json()
    print(req_json, file=sys.stderr)

    try:
        date_dict = req_json.get('date')
        correlation = req_json.get('correlation')
        mode = req_json.get('mode')

        date = mc.mayadate.from_dict(date_dict)

        response_dict = {
            'success' : True,
            'correlation' : correlation
        }

        if mode == 'julian':
            jd = date.to_julian(correlation=correlation)

            response_dict['date'] = {
                'day' : jd.day,
                'month' : jd.month,
                'year': jd.year
            }

        elif mode == 'gregorian':
            gd = date.to_gregorian(correlation=correlation)

            response_dict['date'] = {
                'day' : gd.day,
                'month' : gd.month,
                'year': gd.year
            }

        elif mode == 'julian_day':
            jdn = date.to_julian_day(correlation=correlation)

            response_dict['date'] = {
                'day_number' : jdn
            }

        else:
            response_dict['success'] = False
            response_dict['message'] = f"Invalid mode {mode} - must be one of 'julian', 'gregorian', or 'julian_day'"

    except:
        response_dict = {
            'success' : False,
            'message' : 'Could not convert the given date'
        }


    return jsonify(response_dict)


@app.route(f'{api_route}convert/to_maya', methods=['POST'])
def convert_to_maya():
    return
