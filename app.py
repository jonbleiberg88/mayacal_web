import sys

from flask import Flask, request, jsonify, render_template, session
from flask_session import Session
import mayacal as mc


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



api_route = '/api/v1/'

@app.route('/')
def index():
    session.clear()
    return render_template("index.html")

@app.route('/initial_series', methods=['GET', 'POST', 'PUT'])
def initial_series():
    if request.method == "POST":
        req_json = request.get_json()

        # try:
        #TODO fix server response apostophes
        initial_series = json_to_mayadate(req_json)

        session["initial_series"] = initial_series

        response_dict = {
            'success' : True,
            'message' : "Initial series successfully posted"}
        return jsonify(response_dict)

        # except:
        #     response_dict = {
        #         'success' : False,
        #         'message' : "Could not parse given initial series"}

            # return jsonify(response_dict)

    return

@app.route('/distance_number', methods=['GET', 'POST', 'PUT'])
def distance_number():
    if request.method != "GET":
        req_json = request.get_json()
        row = req_json["row"]

        initial_series = session.get("initial_series")
        if session.get("distance_numbers") is None:
            session["distance_numbers"] = []

        dn = json_to_distance_number(req_json["distance_number"])
        if request.method == 'PUT':
            if row - 1  <  len(session["distance_numbers"]):
                session["distance_numbers"][row-1] = dn
            else:
                session["distance_numbers"].append(dn)
        elif request.method == 'POST':
            session["distance_numbers"].insert(row-1, dn)
        else:
            return jsonify({
                        'success' : False,
                        'message' : "Unrecognized request type"
                            })

        dns = session["distance_numbers"]
        response_dict = {
            'success' : True,
            'resulting_dates' : []
        }
        current_lc = initial_series.long_count
        for idx, dn in enumerate(dns):
            current_lc = current_lc + dn
            response_dict['resulting_dates'].append({
                    'row' : idx + 1,
                    'date' : current_lc.get_mayadate().to_dict()
                })

        return jsonify(response_dict)








@app.route(f'{api_route}infer', methods=['POST'])
def infer():
    req_json = request.get_json()
    print(req_json, file=sys.stderr)

    try:

        date = json_to_mayadate(req_json)
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


def json_to_mayadate(json_obj):
    #TODO fix server response apostophes
    day_name = json_obj['calendar_round']['tzolkin']['day_name']
    if day_name is not None:
        json_obj['calendar_round']['tzolkin']['day_name'] = day_name.replace("'","")

    month_name = json_obj['calendar_round']['haab']['month_name']
    if month_name is not None:
        json_obj['calendar_round']['haab']['month_name'] = month_name.replace("'","")

    date = mc.mayadate.from_dict(json_obj)

    return date

def json_to_distance_number(json_obj):
    sign = json_obj['sign']

    baktun = json_obj['baktun']
    katun = json_obj['katun']
    tun = json_obj['tun']
    winal = json_obj['winal']
    kin = json_obj['kin']

    lc = mc.LongCount(baktun, katun, tun, winal, kin)

    return mc.DistanceNumber(lc, sign)
