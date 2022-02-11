from flask import Flask, request, jsonify, Response
import cloudinary
import cloudinary.uploader
from flask_pymongo import PyMongo
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config[
    "MONGO_URI"
] = "mongodb+srv://adri:adri@cluster0.5izav.mongodb.net/bring_me_app?retryWrites=true&w=majority"
mongo = PyMongo(app)

CORS(app)

# David: yo creo que esto debería ir en el frontend, que es el que en realidad envía la foto
# Si acaso en el frontend habría que añadir un endpoint para pasar la url de la foto a los datos
# del usuario que conduce.
cloudinary.config(
    cloud_name="pepebravo-uma",
    api_key="998694649361965",
    api_secret="0Ro2NXoAAigu0qfBuJHfdkBKPZU"
)

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
    imageUrl = request.json["imageUrl"]

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
                "imageUrl" : imageUrl,
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
    print(response)
    return Response(response, mimetype="application/json")


@app.route("/trip/<id>", methods=["GET"])
def get_trip(id):
    trip = mongo.db.trips.find_one({"_id": ObjectId(id)})
    response = json_util.dumps(trip)
    return Response(response, mimetype="application/json")

@app.route("/trip/driver/<id>", methods=["GET"])
def get_trips_by_driver(id):
    trip = mongo.db.trips.find({"driver": id})
    response = json_util.dumps(trip)
    print(response)
    return Response(response, mimetype="application/json")

@app.route("/trip/date/<date>", methods=["GET"])
def get_trips_by_date(date):
    trip = mongo.db.trips.find({"date": date})
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
        {"$and": [{"origin": {"$regex": ".*" + name1 + "*."}}, {"destination": {"$regex": ".*" + name2 + "*."}}]}
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
    imageUrl = request.json["imageUrl"]

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
                    "imageUrl" : imageUrl,
                }
            },
        )

        response = jsonify({"message": "Trip with id=" + id + " updated succesfully"})
        return response
    else:
        return not_found()


@app.route("/trip/<id>", methods=["DELETE"])
def delete_trip(id):
    data = mongo.db.trips.delete_one({"_id": ObjectId(id)})
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
        if (sender not in users_id and (sender != ObjectId(id))):
            users_id.append(sender)
        if (receiver not in users_id and (receiver != ObjectId(id))):
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

@app.route("/message/<id>", methods=["GET"])
def get_messageById(id):
    data = mongo.db.messages.find_one({"_id": ObjectId(id)})
    response = json_util.dumps(data)
    return Response(response, mimetype="application/json")


# ----------------------------------------------------------------------------------------------------------------------------------------------------------
# Datos externos
@app.route("/precio-carburante/<ccaa>", methods=["GET"])
def get_precio_carburante(ccaa):
    url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
    data = requests.get(url).json()['ListaEESSPrecio']
    data_filtrada = []
    for gasolinera in data:
        if gasolinera['IDCCAA'] == ccaa:
            data_filtrada.append(gasolinera)
    response = json_util.dumps(data_filtrada)
    return Response(response, mimetype="application/json")

# gasolineras por codigo de provincia
# malaga es 29
@app.route("/gasolineras-provincia/<id>", methods=["GET"])
def get_gasolinera_by_province(id):
    url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
    data = requests.get(url).json()['ListaEESSPrecio']
    data_filtrada = []
    for gasolinera in data:
        if gasolinera['IDProvincia'] == id:
            data_filtrada.append(gasolinera)
    return {"gasolineras":data_filtrada}

# gasolineras por codigo de municipio
# algarrobo 4459
@app.route("/gasolineras-municipio/<id>", methods=["GET"])
def get_gasolinera_by_municipio(id):
    url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
    data = requests.get(url).json()['ListaEESSPrecio']
    data_filtrada = []
    for gasolinera in data:
        if gasolinera['IDMunicipio'] == id:
            data_filtrada.append(gasolinera)
    return {"gasolineras":data_filtrada}

# gasolineras que tienen biodiesel
@app.route("/gasolineras-biodiesel", methods=["GET"])
def get_gasolinera_biodiesel():
    url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
    data = requests.get(url).json()['ListaEESSPrecio']
    data_filtrada = []
    for gasolinera in data:
        if gasolinera['Precio Biodiesel'] != "":
            data_filtrada.append(gasolinera)
    response = json_util.dumps(data_filtrada)
    return Response(response, mimetype="application/json")


# ----------------------------------------------------------------------------------------------------------------------------------------------------------



@app.errorhandler(404)
def not_found(error=None):
    message = {"message": "Resource Not Found " + request.url, "status": 404}
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run(debug=True)
