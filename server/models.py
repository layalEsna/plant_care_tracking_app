


################

from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship
import re
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
# note
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from datetime import date


# CASCADE

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    plants = db.relationship('Plant', back_populates='user')

    @validates('username')
    def validate_username(self, key, username):
        if not username or not isinstance(username, str):
            raise ValueError('Username is required and must be a string.')
        if len(username) < 5 or len(username) > 100:
            raise ValueError('Username must be between 5 and 100 characters inclusive.')
        return username

    @property
    def password(self):
        raise AttributeError('Password is read-only.')

    @password.setter
    def password(self, password):
        pattern = re.compile(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$')
        if not password or not isinstance(password, str):
            raise ValueError('Password is required and must be a string')
        if not pattern.match(password):
            raise ValueError('Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one symbol')
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        print(f"Stored hash: {self.password_hash}")
        print(f"Input password: {password}")
        result = bcrypt.check_password_hash(self.password_hash, password)
        print(f"Bcrypt result: {result}")
        return result

    # def check_password(self, password):
    #     return bcrypt.check_password_hash(self.password_hash, password)

class Plant(db.Model):
    __tablename__ = 'plants'

    id = db.Column(db.Integer, primary_key=True)
    plant_name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String, nullable=True)
    created_at = db.Column(db.Date, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    user = db.relationship('User', back_populates='plants')
    category = db.relationship('Category', back_populates='plants')
    care_notes = db.relationship('CareNote', back_populates='plant', cascade="all, delete-orphan")

    @validates('plant_name')
    def validate_plant_name(self, key, plant_name):
        if not plant_name or not isinstance(plant_name, str):
            raise ValueError('Plant_name is required and must be a string.')
        if len(plant_name) < 2 or len(plant_name) > 100:
            raise ValueError('plant_name must be between 2 and 100 characters inclusive.')
        return plant_name
    @validates('created_at')
    def validate_created_at(self, key, created_at):
        if not created_at or not isinstance(created_at, date):
            raise ValueError('created_at is required and must be a date type.')
        return created_at
            
class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)

    plants = db.relationship('Plant', back_populates='category')

    @validates('category_name')
    def validate_category_name(self, key, category_name):
        if not category_name or not isinstance(category_name, str):
            raise ValueError('Category_name is required and must be a string.')
        if len(category_name) < 5 or len(category_name) > 100:
            raise ValueError('category_name must be between 5 and 100 characters inclusive.')
        return category_name


class CareNote(db.Model):
    __tablename__ = 'care_notes'

    id = db.Column(db.Integer, primary_key=True)
    care_type = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.Integer, nullable=True)
    starting_date = db.Column(db.Date, nullable=False)
    next_care_date = db.Column(db.Date, nullable=False)
    custom_interval = db.Column(db.Integer, nullable=True)

    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'), nullable=False)
    plant = db.relationship('Plant', back_populates='care_notes')

    @validates('care_type')
    def validate_care_type(self, key, care_type):
        if not care_type or not isinstance(care_type, str):
            raise ValueError('care_type is required and must be a string.')
        if len(care_type) < 5 or len(care_type) > 100:
            raise ValueError('care_type must be between 5 and 100 characters inclusive.')
        return care_type
    
    @validates('frequency')
    def validate_frequency(self, key, frequency):
        if frequency is not None and not isinstance(frequency, int):
            raise ValueError('Frequency must be an integer.')
        if frequency is not None and frequency < 1:
            raise ValueError('Frequency must be a positive integer.')
        return frequency

    @validates('starting_date')
    def validate_starting_date(self, key, starting_date):
        if not starting_date or not isinstance(starting_date, date):
            raise ValueError('starting_date is required and must be a date type.')
        return starting_date
        
    @validates('next_care_date')
    def validate_next_care_date(self, key, next_care_date):
        if not next_care_date or not isinstance(next_care_date, date):
            raise ValueError('next_care_date is required and must be a date type.')
        return next_care_date
        
    @validates('custom_interval')
    def validate_custom_interval(self, key, custom_interval):
        if custom_interval is not None and not isinstance(custom_interval, int):
            raise ValueError('custom_interval must be an integer.')
        if custom_interval is not None and custom_interval < 1:
            raise ValueError('custom_interval must be a positive integer.')
        return custom_interval
    

class PlantSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Plant
        load_instance = True
    user = fields.Nested('UserSchema', exclude=('plants',))  
    category = fields.Nested('CategorySchema', exclude=('plants',))  
    
    care_notes = fields.Nested('CareNoteSchema', many=True, exclude=('plant',))
    created_at = fields.Date(format='%Y-%m-%d')

class CategorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
    plants = fields.Nested('PlantSchema', many=True, exclude=('category', 'user'))
    # categories = fields.Method('get_categories')
    # def get_categories(self, user):
    #     user_categories = {plant.category for plant in user.plants}
    #     return CategorySchema(many=True).dump(user_categories)


class CareNoteSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CareNote
        load_instance = True
    plant = fields.Nested('PlantSchema', exclude=('user', 'care_notes',))
    starting_date = fields.Date(format='%Y-%m-%d')
    next_care_date = fields.Date(format='%Y-%m-%d')

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True
        exclude = ('password_hash',)
    plants = fields.Nested('PlantSchema', many=True, exclude=('user',))  
    categories = fields.Method('get_categories')

    def get_categories(self, user):
    
        if not user.plants:
            return []  
    
        unique_category_names = list({plant.category.category_name for plant in user.plants if plant.category})
        return unique_category_names 






    

