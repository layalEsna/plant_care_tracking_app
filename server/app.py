# # #!/usr/bin/env python3

# # # Standard library imports

# # # Remote library imports
# # from flask import request
# # from flask_restful import Resource

# # # Local imports
# # from config import app, db, api
# # # Add your model imports

# #######################
# from flask import Flask, request, make_response, jsonify, session
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_restful import Api, Resource
# from models import db, bcrypt, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema

# from werkzeug.security import generate_password_hash
# from flask_session import Session
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env BEFORE creating the app instance
# load_dotenv()

# # Instantiate app
# app = Flask(__name__)
# app.config.from_object('config.Config')  # Use string to avoid circular import issues.
# print(f"SECRET_KEY loaded: {app.config['SECRET_KEY']}") #print the secret key after the app config is loaded.

# # Initialize extensions
# db.init_app(app)
# bcrypt.init_app(app)
# migrate = Migrate(app, db)

# # Instantiate REST API
# api = Api(app)
# # Instantiate CORS
# CORS(app, supports_credentials=True)
# Session(app)

# # Import models after initializing db to prevent circular imports
# # from models import db, User, Category, Plant, CareNote, PlantSchema, UserSchema, CategorySchema, CareNoteSchema



# # Views go here!

# @app.route('/')
# def index():
#     return '<h1>Project Server</h1>'


# if __name__ == '__main__':
#     app.run(port=5555, debug=True)

######################

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
        print('User data:', user)
        
        user_schema = UserSchema()
        plants_schema = PlantSchema(many=True)
        category_schema = CategorySchema(many=True)

        plants = user.plants
        categories = Category.query.all()

        result = user_schema.dump(user)
        result['plants'] = plants_schema.dump(plants)
        result['categories'] = category_schema.dump(categories)
        
        return jsonify(result), 200
    
api.add_resource(CheckSession,'/check_session')


if __name__ == '__main__':
    app.run(port=5555, debug=True)


# # python server/app.py
# flask run --port=5555
#  PYTHONPATH=server python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/app.py

# export PYTHONPATH=$(pwd)/server
# python server/seed.py




