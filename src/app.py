import json
import requests
from flask import Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util
from bson.objectid import ObjectId

app = Flask(__name__)
app.config[
    "MONGO_URI"
] = "mongodb+srv://adri:adri@cluster0.5izav.mongodb.net/bring_me_app?retryWrites=true&w=majority"
mongo = PyMongo(app)

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Users


@app.route("/user", methods=["POST"])
def create_user():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    address = request.json["address"]
    zip_code = request.json["zip_code"]
    phone = request.json["phone"]
    admin = request.json["admin"]

    if name and email and password and address and zip_code and phone and admin:
        hashed_password = generate_password_hash(password)
        id = mongo.db.user.insert(
            {
                "name": name,
                "email": email,
                "password": hashed_password,
                "address": address,
                "zip_code": int(zip_code),
                "phone": int(phone),
                "admin": int(admin),
            }
        )
        response = {"message": "User " + str(id) + " created successfully."}
        return response
    else:
        return not_found()


@app.route("/user", methods=["GET"])
def get_users():
    users = mongo.db.user.find()
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


@app.route("/user/<id>", methods=["GET"])
def get_user(id):
    users = mongo.db.user.find_one({"_id": ObjectId(id)})
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


@app.route("/user/name/<name>", methods=["GET"])
def get_users_by_name(name):
    users = mongo.db.user.find({"name": {"$regex": ".*" + name + "*."}})
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


@app.route("/user/email/<email>", methods=["GET"])
def get_users_by_email(email):
    users = mongo.db.user.find({"email": {"$regex": ".*" + email + "*."}})
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


@app.route("/user/<id>", methods=["PUT"])
def update_user(id):
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    address = request.json["address"]
    zip_code = request.json["zip_code"]
    phone = request.json["phone"]
    admin = request.json["admin"]

    hashed_password = generate_password_hash(password)

    if name and email and password and address and zip_code and phone and admin:
        mongo.db.user.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "password": hashed_password,
                    "address": address,
                    "zip_code": int(zip_code),
                    "phone": int(phone),
                    "admin": int(admin),
                }
            },
        )

        response = jsonify({"message": "User with id=" + id + " updated succesfully"})
        return response
    else:
        return not_found()


@app.route("/user/<id>", methods=["DELETE"])
def delete_user(id):
    mongo.db.user.delete_one({"_id": ObjectId(id)})
    response = jsonify({"message": "User with id=" + id + " deleted succesfully"})
    return response


# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Trips


@app.route("/trip", methods=["POST"])
def create_trip():
    driver = request.json["driver"]
    date = request.json["date"]
    origin = request.json["origin"]
    originLatitude = request.json["originLatitude"]
    originLongitude = request.json["originLongitude"]
    destination = request.json["destination"]
    destinationLatitude = request.json["destinationLatitude"]
    destinationLongitude = request.json["destinationLongitude"]
    seats = request.json["seats"]

    if (
        driver
        and date
        and origin
        and originLatitude
        and originLongitude
        and destination
        and destinationLatitude
        and destinationLongitude
        and seats
    ):
        id = mongo.db.trips.insert(
            {
                "driver": driver,
                "date": date,
                "origin": origin,
                "originLatitude": float(originLatitude),
                "originLongitude": float(originLongitude),
                "destination": destination,
                "destinationLatitude": float(destinationLatitude),
                "destinationLongitude": float(destinationLongitude),
                "seats": int(seats),
            }
        )
        response = jsonify(
            {"message": "Trip with id=" + str(id) + " created succesfully"}
        )
        return response
    else:
        return not_found()


@app.route("/trip", methods=["GET"])
def get_trips():
    trips = mongo.db.trips.find()
    response = json_util.dumps(trips)
    return Response(response, mimetype="application/json")


@app.route("/trip/<id>", methods=["GET"])
def get_trip(id):
    trip = mongo.db.trips.find_one({"_id": ObjectId(id)})
    response = json_util.dumps(trip)
    return Response(response, mimetype="application/json")


@app.route("/trip/minseats/<numseats>", methods=["GET"])
def get_trips_with_minimum_seats(numseats):
    trips = mongo.db.trips.find({"seats": {"$gte": int(numseats)}})
    response = json_util.dumps(trips)
    return Response(response, mimetype="application/json")


@app.route("/trip/origin/<name>", methods=["GET"])
def get_trips_by_origin(name):
    trips = mongo.db.trips.find({"origin": {"$regex": ".*" + name + "*."}})
    response = json_util.dumps(trips)
    return Response(response, mimetype="application/json")


@app.route("/trip/destination/<name>", methods=["GET"])
def get_trips_by_destination(name):
    trips = mongo.db.trips.find({"destination": {"$regex": ".*" + name + "*."}})
    response = json_util.dumps(trips)
    return Response(response, mimetype="application/json")


@app.route("/trip/origin_destination/<name1>/<name2>", methods=["GET"])
def get_origin_destination(name1, name2):
    trips = mongo.db.trips.find(
        {
            "$and": [
                {"origin": {"$regex": ".*" + name1 + "*."}},
                {"destination": {"$regex": ".*" + name2 + "*."}},
            ]
        }
    )
    response = json_util.dumps(trips)
    return Response(response, mimetype="application/json")


@app.route("/trip/<id>", methods=["PUT"])
def update_trip(id):
    driver = request.json["driver"]
    date = request.json["date"]
    origin = request.json["origin"]
    originLatitude = request.json["originLatitude"]
    originLongitude = request.json["originLongitude"]
    destination = request.json["destination"]
    destinationLatitude = request.json["destinationLatitude"]
    destinationLongitude = request.json["destinationLongitude"]
    seats = request.json["seats"]

    if (
        driver
        and date
        and origin
        and originLatitude
        and originLongitude
        and destination
        and destinationLatitude
        and destinationLongitude
        and seats
    ):
        mongo.db.trips.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "driver": driver,
                    "date": date,
                    "origin": origin,
                    "originLatitude": float(originLatitude),
                    "originLongitude": float(originLongitude),
                    "destination": destination,
                    "destinationLatitude": float(destinationLatitude),
                    "destinationLongitude": float(destinationLongitude),
                    "seats": int(seats),
                }
            },
        )

        response = jsonify({"message": "Trip with id=" + id + " updated succesfully"})
        return response
    else:
        return not_found()


@app.route("/trip/<id>", methods=["DELETE"])
def delete_trip(id):
    mongo.db.trips.delete_one({"_id": ObjectId(id)})
    response = jsonify({"message": "Trip with id=" + id + " deleted succesfully"})
    return response


# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Messages


@app.route("/message", methods=["POST"])
def create_message():
    sender = request.json["sender"]
    receiver = request.json["receiver"]
    message = request.json["message"]
    date = request.json["date"]

    if sender and receiver and date:
        id = mongo.db.messages.insert_one(
            {"sender": sender, "receiver": receiver, "message": message, "date": date}
        )
        response = jsonify({"message": "Message " + str(id) + " created succesfully"})
        return response
    else:
        return not_found()


@app.route("/message", methods=["GET"])
def get_messages():
    messages = mongo.db.messages.find()
    response = json_util.dumps(messages)
    return Response(response, mimetype="application/json")


@app.route("/message/containing/<text>", methods=["GET"])
def get_messages_containing_text(text):
    messages = mongo.db.messages.find({"message": {"$regex": ".*" + text + "*."}})
    response = json_util.dumps(messages)
    return Response(response, mimetype="application/json")


@app.route("/conversation/<id>", methods=["GET"])
def get_conversations(id):
    messages = mongo.db.messages.find({"$or": [{"sender": id}, {"receiver": id}]})
    users_id = []
    for message in messages:
        receiver = ObjectId(message.get("receiver"))
        sender = ObjectId(message.get("sender"))
        if sender not in users_id and (sender != ObjectId(id)):
            users_id.append(sender)
        if receiver not in users_id and (receiver != ObjectId(id)):
            users_id.append(receiver)
    users = mongo.db.user.find({"_id": {"$in": users_id}})
    response = json_util.dumps(users)
    return Response(response, mimetype="application/json")


@app.route("/conversation/<id1>/<id2>", methods=["GET"])
def get_conversation(id1, id2):
    messages = mongo.db.messages.find(
        {"$or": [{"sender": id1, "receiver": id2}, {"sender": id2, "receiver": id1}]}
    )
    messages = sorted(messages, key=lambda k: k["date"], reverse=False)
    response = json_util.dumps(messages)
    return Response(response, mimetype="application/json")


@app.route("/message/<id>", methods=["PUT"])
def update_message(id):
    sender = request.json["sender"]
    receiver = request.json["receiver"]
    message = request.json["message"]
    date = request.json["date"]

    if sender and receiver and date:
        mongo.db.messages.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "sender": sender,
                    "receiver": receiver,
                    "message": message,
                    "date": date,
                }
            },
        )

        response = jsonify(
            {"message": "Message with id=" + id + " updated succesfully"}
        )
        return response
    else:
        return not_found()


@app.route("/message/<id>", methods=["DELETE"])
def delete_message(id):
    mongo.db.messages.delete_one({"_id": ObjectId(id)})
    response = jsonify({"message": "Message with id=" + id + " deleted succesfully"})
    return response


# ----------------------------------------------------------------------------------------------------------------------------------------------------------
# Datos externos


@app.route("/precio-carburante", methods=["GET"])
def get_precio_carburante():
    url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
    data = requests.get(url).json()
    return data


# ----------------------------------------------------------------------------------------------------------------------------------------------------------


@app.errorhandler(404)
def not_found(error=None):
    message = {"message": "Resource Not Found " + request.url, "status": 404}
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run(debug=True)
