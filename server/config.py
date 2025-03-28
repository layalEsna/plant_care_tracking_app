# # Standard library imports

# # Remote library imports
# from flask import Flask
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_restful import Api
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import MetaData

# # Local imports

# # Instantiate app, set attributes
# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.json.compact = False

# # Define metadata, instantiate db
# metadata = MetaData(naming_convention={
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
# })
# db = SQLAlchemy(metadata=metadata)
# migrate = Migrate(app, db)
# db.init_app(app)

# # Instantiate REST API
# api = Api(app)

# # Instantiate CORS
# CORS(app)

#################
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'your_default_secret_key'
    # SQLALCHEMY_DATABASE_URI = 'sqlite:////Users/layla/Development/code/se-prep/phase-4/plant_care_tracking_app/server/app.db'
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/app.db'
    SQLALCHEMY_DATABASE_URI = 'sqlite:////Users/layla/Development/code/se-prep/phase-4/plant_care_tracking_app/server/instance/app.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    SESSION_FILE_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'flask_session')
