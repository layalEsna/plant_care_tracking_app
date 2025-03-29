

###################### plants_schema

from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from models import db, bcrypt, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema
# from server.models import db, bcrypt, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema

from werkzeug.security import generate_password_hash
from flask_session import Session
import os
from dotenv import load_dotenv

# Load environment variables from .env BEFORE creating the app instance
load_dotenv()

# Instantiate app
app = Flask(__name__)
# app.config.from_object('config.Config')  # Use string to avoid circular import issues.
# app.config.from_object('server.config.Config')
# from server.config import Config
from config import Config

app.config.from_object(Config)


print(f"SECRET_KEY loaded: {app.config['SECRET_KEY']}")  # Print the secret key after the app config is loaded.

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app, supports_credentials=True)

# Session handling
Session(app)

# Views go here!
@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized.'}, 401
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found.'}, 404
        
        
        user_schema = UserSchema()
        plants_schema = PlantSchema(many=True)
        category_schema = CategorySchema(many=True)

        plants = user.plants
        categories = Category.query.all()

        result = user_schema.dump(user)
        result['plants'] = plants_schema.dump(plants)
        result['categories'] = category_schema.dump(categories)
        
        return result, 200
    
class Signup(Resource):
    
    def post(self):

        try:
            data = request.get_json()
            username = data.get('username')
           
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            if not all([username, password, confirm_password]):
                return make_response(jsonify({'error': 'All the fields are required.'}), 400)
            if password != confirm_password:
                return make_response(jsonify({'error': 'Password not match.'}), 400)
            if User.query.filter(User.username==username).first():
                return make_response(jsonify({'error': 'unique constraint'}), 400)
            
            
            new_user = User(
                username = username,
                password = password,
                
            )

            db.session.add(new_user)
            db.session.commit()            
            session['user_id'] = new_user.id
            session.permanent = True 

            return make_response(jsonify({'id': new_user.id, 'username': new_user.username}), 201)

        except Exception as e:
            return make_response(jsonify({'error': f'Internal error: {e}'}), 500)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return {'error': 'All fields are required'}, 400


        user = User.query.filter(User.username == username).first()

        if not user or not user.check_password(password):
            return {'error': 'Username or password not found'}, 404
        print("Session user_id before login:", session.get("user_id"))

        session['user_id'] = user.id
        session.permanent = True
        return {
                'username': user.username,
                'id': user.id
            }, 200
    
class UserById(Resource):
    def get(self, user_id):
        user_session_id = session.get('user_id')
        if user_session_id is None or user_session_id != user_id:
            return {'error': 'Unauthorized or user not found.'}, 403
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found.'}, 404
        user_schema = UserSchema()
        return jsonify(user_schema.dump(user)), 200
        



    
api.add_resource(CheckSession,'/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(UserById, '/users/<int:user_id>')



if __name__ == '__main__':
    app.run(port=5555, debug=True)


# # python server/app.py
# flask run --port=5555
#  PYTHONPATH=server python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/seed.py




