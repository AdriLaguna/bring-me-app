from flask import Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util
from bson.objectid import ObjectId 

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://adri:adri@cluster0.5izav.mongodb.net/bring_me_app?retryWrites=true&w=majority'
mongo = PyMongo(app)

@app.route('/user', methods=['POST'])
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

@app.route('/user', methods=['GET'])
def get_users():
    users = mongo.db.user.find()
    response = json_util.dumps(users)
    return Response(response, mimetype='application/json')

@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    users = mongo.db.user.find_one({'_id': ObjectId(id)})
    response = json_util.dumps(users)
    return Response(response, mimetype='application/json')

@app.route('/user/<id>', methods=['PUT'])
def update_user(id):
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    address = request.json['address']
    zip_code = request.json['zip_code']
    phone = request.json['phone']
    admin = request.json['admin']

    hashed_password = generate_password_hash(password)

    if name and email and password and address and zip_code and phone and admin:
        mongo.db.user.update_one({'_id': ObjectId(id)}, {'$set': {'name': name, 'email': email, 'password': hashed_password,
            'address': address, 'zip_code': int(zip_code), 'phone': int(phone), 'admin': int(admin)}})
        
        response = jsonify({'message': 'User with id='+ id + ' updated succesfully'})
        return response
    else:
        return not_found()

@app.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    mongo.db.user.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'User with id='+ id + ' deleted succesfully'})
    return response

#-------------------------------------------------------------------------------------------------------------------------------------------------------------
#Viajes
@app.route('/trips', methods=['POST'])
def create_trip():
    driver = request.json['driver']
    date = request.json['date']
    originLatitude = request.json['originLatitude']
    originLongitude = request.json['originLongitude']
    destinationLatitude = request.json['destinationLatitude']
    destinationLongitude = request.json['destinationLongitude']
    seats = request.json['seats']
    
    if driver and date and originLatitude and originLongitude and destinationLatitude and destinationLongitude:
        id = mongo.db.trips.insert(
            {'driver': driver, 'date': date, 'originLatitude': originLatitude, 'originLongitude': originLongitude, 'destinationLatitude': destinationLatitude,
            'destinationLongitude': destinationLongitude, 'seats': seats}
        )
        response = jsonify({'message': 'Trip with id='+ str(id) +' created succesfully'})
        return response
    else:
        return not_found()

@app.route('/trips', methods=['GET'])
def get_trips():
    trips = mongo.db.trips.find()
    response = json_util.dumps(trips)
    return Response(response, mimetype='application/json')

@app.route('/trips/<id>', methods=['GET'])
def get_trip(id):
    trip = mongo.db.trips.find_one({'_id': ObjectId(id)})
    response = json_util.dumps(trip)
    return Response(response, mimetype='application/json')

@app.route('/trips/<id>', methods=['PUT'])
def update_trip(id):
    driver = request.json['driver']
    date = request.json['date']
    originLatitude = request.json['originLatitude']
    originLongitude = request.json['originLongitude']
    destinationLatitude = request.json['destinationLatitude']
    destinationLongitude = request.json['destinationLongitude']
    seats = request.json['seats']

    if driver and date and originLatitude and originLongitude and destinationLatitude and destinationLongitude:
        mongo.db.trips.update_one({'_id': ObjectId(id)}, {'$set': {'driver': driver, 'date': date, 'originLatitude': originLatitude,
            'originLongitude': originLongitude, 'destinationLatitude': destinationLatitude, 'destinationLongitude': destinationLongitude, 'seats': seats}})
        
        response = jsonify({'message': 'Trip with id='+ id + ' updated succesfully'})
        return response
    else:
        return not_found()

@app.route('/trips/<id>', methods=['DELETE'])
def delete_trip(id):
    mongo.db.trips.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'Trip with id='+ id + ' deleted succesfully'})
    return response

#-------------------------------------------------------------------------------------------------------------------------------------------------------------
#Menssage
@app.route('/message', methods=['POST'])
def create_message():
    sender = request.json['sender']
    receiver = request.json['receiver']
    message = request.json['message']
    date = request.json['date']
    
    if sender and receiver and date:
        id = mongo.db.messages.insert_one(
            {'sender': sender, 'receiver': receiver, 'message': message, 'date': date}
        )
        response = jsonify({'message': 'Message '+ str(message) +' created succesfully'})
        return response
    else:
        return not_found()

@app.route('/message', methods=['GET'])
def get_messages():
    messages = mongo.db.messages.find()
    response = json_util.dumps(messages)
    return Response(response, mimetype='application/json')

@app.route('/message/<id1>/<id2>', methods=['GET'])
def get_conversation(id1,id2):
    messages1 = mongo.db.messages.find({"$or":[ {'sender': id1, 'receiver': id2}, {'sender': id2, 'receiver': id1}]})
    messages1 = sorted(messages1, key=lambda k: k['date'], reverse=False)
    response = json_util.dumps(messages1)
    return Response(response, mimetype='application/json')

@app.route('/message/<id>', methods=['PUT'])
def update_message(id):
    sender = request.json['sender']
    receiver = request.json['receiver']
    message = request.json['message']
    date = request.json['date']

    if sender and receiver and date:
        mongo.db.messages.update_one({'_id': ObjectId(id)}, {'$set': {'sender': sender, 'receiver': receiver, 'message': message, 'date': date}})
        
        response = jsonify({'message': 'Message with id='+ id + ' updated succesfully'})
        return response
    else:
        return not_found()

@app.route('/message/<id>', methods=['DELETE'])
def delete_message(id):
    mongo.db.messages.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'Message with id='+ id + ' deleted succesfully'})
    return response
#----------------------------------------------------------------------------------------------------------------------------------------------------------


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
