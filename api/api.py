import time
from lib2to3.refactor import _identity

from flask import Flask, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt, JWTManager
from models import User, db

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }
    #access_token = create_access_token(identity=email)
    #return jsonify(access_token=access_token), 200
    #user = User.query.filter_by(email=email, password=password).first()

    #if user is not None:
        #access_token = create_access_token(identity=email)
        #return jsonify(access_token=access_token), 200
    #else:
        #return jsonify({"msg": "Incorrect email or password"}), 400


@app.route('/api/thelogin', methods=['GET', 'POST'])
def thelogin():
    try:
        data = parser.parse_args()
        current_user = User.query.filter(User.email==data['email']).first()

        if not current_user:
            return {"error":"User not in DB. Register as a new user"}

        password = hashlib.md5(data['password'].encode()).hexdigest()
        if current_user.password == password :
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {
                'username': current_user.username,
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            return {'error': 'Wrong credentials'}
    except:
        raise Exception("Cannot login user")
