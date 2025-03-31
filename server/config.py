
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'your_default_secret_key'
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:////Users/layla/Development/code/se-prep/phase-4/plant_care_tracking_app/server/instance/app.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    SESSION_FILE_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'flask_session')
