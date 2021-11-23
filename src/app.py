from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash

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
