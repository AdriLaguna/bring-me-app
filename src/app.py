from flask import Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util
from bson.objectid import ObjectId 

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://adri:adri@cluster0.5izav.mongodb.net/bring_me_app?retryWrites=true&w=majority'
mongo = PyMongo(app)

@app.route('/users', methods=['POST'])
def create_user():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    address = request.json['address']
    zip_code = request.json['zip_code']
    phone = request.json['phone']
    admin = request.json['admin']

    if name and email and password and address and zip_code and phone and admin:
        hashed_password = generate_password_hash(password)
        id = mongo.db.user.insert(
            {
                'name': name,
                'email': email,
                'password': hashed_password,
                'address': address,
                'zip_code': int(zip_code),
                'phone': int(phone),
                'admin': int(admin)
            }
        )
        response = {
            'message': 'User ' + str(id) + ' created successfully.'
        }
        return response
    else:
        return not_found()

#-------------------------------------------------------------------------------------------------------------------------------------------------------------
#Viajes
@app.route('/viajes', methods=['POST'])
def create_viaje():
    conductor = request.json['conductor']
    fecha = request.json['fecha']
    origenLatitud = request.json['origenLatitud']
    origenLongitud = request.json['origenLongitud']
    destinoLatitud = request.json['destinoLatitud']
    destinoLongitud = request.json['destinoLongitud']
    plazas = request.json['plazas']
    
    if conductor and fecha and origenLatitud and origenLongitud and destinoLatitud and destinoLongitud:
        id = mongo.db.viajes.insert(
            {'conductor': conductor, 'fecha': fecha, 'origenLatitud': origenLatitud, 'origenLongitud': origenLongitud, 'destinoLatitud': destinoLatitud,
            'destinoLongitud': destinoLongitud, 'plazas': plazas}
        )
        response = jsonify({'message': 'Viaje con id='+ str(id) +' creado satisfactoriamente'})
        return response
    else:
        return not_found()

@app.route('/viajes', methods=['GET'])
def get_viajes():
    viajes = mongo.db.viajes.find()
    response = json_util.dumps(viajes)
    return Response(response, mimetype='application/json')

@app.route('/viajes/<id>', methods=['GET'])
def get_viaje(id):
    viaje = mongo.db.viajes.find_one({'_id': ObjectId(id)})
    response = json_util.dumps(viaje)
    return Response(response, mimetype='application/json')

@app.route('/viajes/<id>', methods=['PUT'])
def update_viaje(id):
    conductor = request.json['conductor']
    fecha = request.json['fecha']
    origenLatitud = request.json['origenLatitud']
    origenLongitud = request.json['origenLongitud']
    destinoLatitud = request.json['destinoLatitud']
    destinoLongitud = request.json['destinoLongitud']
    plazas = request.json['plazas']

    if conductor and fecha and origenLatitud and origenLongitud and destinoLatitud and destinoLongitud:
        mongo.db.viajes.update_one({'_id': ObjectId(id)}, {'$set': {'conductor': conductor, 'fecha': fecha, 'origenLatitud': origenLatitud,
            'origenLongitud': origenLongitud, 'destinoLatitud': destinoLatitud, 'destinoLongitud': destinoLongitud, 'plazas': plazas}})
        
        response = jsonify({'message': 'Viaje con id='+ id + ' actualizado con éxito'})
        return response
    else:
        return not_found()

@app.route('/viajes/<id>', methods=['DELETE'])
def delete_viaje(id):
    mongo.db.viajes.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'Viaje con id='+ id + ' eliminado con éxito'})
    return response

#-------------------------------------------------------------------------------------------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run(debug=True)
