

###################### SESSION_TYPE
from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
# from .models import db, bcrypt, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema
from server.models import db, bcrypt, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema
from datetime import datetime
from sqlalchemy.exc import IntegrityError 

from werkzeug.security import generate_password_hash
from flask_session import Session
import os
from dotenv import load_dotenv

# Load environment variables from .env BEFORE creating the app instance
load_dotenv()

# Instantiate app
app = Flask(__name__)
# from .config import Config
from server.config import Config


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


# class CheckSession(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {'error': 'Unauthorized.'}, 401
#         user = User.query.get(user_id)
#         if not user:
#             return {'error': 'User not found.'}, 404
        
        
#         user_schema = UserSchema()
        
#         result_user = user_schema.dump(user)
        
        
#         return result_user, 200


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
        
        categories = list(set(plant.category for plant in user.plants if plant.category))
        
        result_user = user_schema.dump(user)
        result_plants = plants_schema.dump(plants)
        result_cats = category_schema.dump(categories)

        result_data = {
            'user': result_user,
            'plants': result_plants,
            'categories': result_cats
        }

                
        return result_data, 200

 


# class CheckSession(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {'error': 'Unauthorized.'}, 401
#         user = User.query.get(user_id)
#         if not user:
#             return {'error': 'User not found.'}, 404

#         user_schema = UserSchema()
#         result = user_schema.dump(user)

#         # Ensure categories are returned as objects
#         categories = list(set(plant.category for plant in user.plants if plant.category))
#         category_schema = CategorySchema(many=True)
#         result['categories'] = category_schema.dump(categories)

#         return result, 200
    

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

        print(f"Login attempt: username='{username}', password='{password}'")

        if not all([username, password]):
            print("Error: Missing username or password")
            return {'error': 'All fields are required'}, 400

        user = User.query.filter(User.username == username).first()

        if user:
            print(f"User found: username='{user.username}', password_hash='{user.password_hash}'")
        else:
            print("User not found in database.")

        if not user or not user.check_password(password):
            print("Error: Incorrect username or password")
            return {'error': 'Username or password not found'}, 404

        print("Login successful")

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
        
        
        categories = [plant.category.category_name for plant in user.plants if plant.category]
        
       
        user_data = UserSchema().dump(user)
        user_data['categories'] = categories
        
        return user_data, 200
    

class NewPlant(Resource):
    def post(self):
        try:
            data = request.get_json()

            plant_name = data.get('plant_name')
            image = data.get('image')
            created_at = data.get('created_at')
            user_id = data.get('user_id')
            category_id = data.get('category_id')

           
            if not plant_name or not isinstance(plant_name, str):
                return {'error': 'Plant name is required and must be a string.'}, 400
            if len(plant_name) < 2 or len(plant_name) > 100:
                return {'error': 'Plant name must be between 2 and 100 characters.'}, 400

           
            try:
                created_at = datetime.strptime(created_at, "%Y-%m-%d")
            except (ValueError, TypeError):
                return {'error': 'created_at is required and must be in YYYY-MM-DD format.'}, 400

            
            if not isinstance(user_id, int):
                return {'error': 'user_id is required and must be an integer.'}, 400

            
            if not isinstance(category_id, int):
                return {'error': 'category_id is required and must be an integer.'}, 400
            
            category = Category.query.get(category_id)
            if not category:
                return {'error': 'Category not found'}, 400

            
            new_plant = Plant(
                plant_name=plant_name,
                image=image,
                created_at=created_at,
                user_id=user_id,
                category_id=category_id
            )

            db.session.add(new_plant)
            db.session.commit()

            return {
                'plant': {
                    'id': new_plant.id,
                    'plant_name': new_plant.plant_name,
                    'image': new_plant.image,
                    'created_at': new_plant.created_at.strftime("%Y-%m-%d"),
                    'user_id': new_plant.user_id,
                    'category_id': new_plant.category_id,
                },
                'category': {
                    'id': category.id,
                    'category_name': category.category_name,
                }
            }, 201  

        except Exception as e:
            
            return {'error': 'Internal Server Error', 'message': str(e)}, 500

class NewCategory(Resource):
    def post(self):
        data = request.get_json()
        category_name = data.get('category_name')

        if not category_name or not isinstance(category_name, str):
            return {'error': 'Category name is required and must be a string.'}, 400
        if len(category_name) < 5 or len(category_name) > 100:
            return {'error': 'Category name must be between 5 and 100 characters.'}, 400
        existing_category = Category.query.filter(Category.category_name == category_name).first()
        if existing_category:
            return {'message': 'category already exists.'}, 200
        
        new_category = Category(category_name = category_name)

        db.session.add(new_category)
        db.session.commit()

        category_schema = CategorySchema()
        category_data = category_schema.dump(new_category)
        return category_data, 201
        

class Categories(Resource):
    def get(self):
        categories = Category.query.all()

        if not categories:
            return {'message': 'No category exists.'}, 200

        return [
            {
                'category_name': category.category_name,
                'id': category.id
            } for category in categories
        ], 200

    
api.add_resource(CheckSession,'/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(UserById, '/users/<int:user_id>')
api.add_resource(NewPlant, '/new_plant')
api.add_resource(Categories, '/categories')
api.add_resource(NewCategory, '/new_category')



if __name__ == '__main__':
    app.run(port=5555, debug=True)


# # python server/app.py
# flask run --port=5555
#  PYTHONPATH=server python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/seed.py

# sqlite3 /Users/layla/Development/code/se-prep/phase-4/plant_care_tracking_app/server/instance/app.db




