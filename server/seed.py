

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from server.app import app, bcrypt
from server.models import db, User, Category, Plant, CareNote
from datetime import datetime, timedelta
from random import randint, choice as rc

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        db.drop_all()
        db.create_all()

        user1 = User(username='Lunaxx')
        user1.password = 'Ddddddddd!'
        user2 = User(username='Darya')
        user2.password = 'Ddddddddd!'
        user3 = User(username='Pardis')
        user3.password = 'Ddddddddd!'
        user4 = User(username='Arshia')
        user4.password = 'Ddddddddd!'

        db.session.add_all([user1, user2, user3, user4])
        db.session.commit()

        category1 = Category(category_name='Succulents')
        category2 = Category(category_name='Ferns')
        category3 = Category(category_name='Flowering Plants')

        db.session.add_all([category1, category2, category3])
        db.session.commit()

        # Assign plants to users with varying categories
        plant_data = [
            ('Aloe Vera', 'image1.jpg', '2023-03-02', user1, category1),  # Lunaxx: Succulents
            ('Spider Plant', 'image2.jpg', '2023-06-02', user2, category2),  # Darya: Ferns
            ('Peace Lily', 'image3.jpg', '2024-03-02', user3, category3),  # Pardis: Flowering Plants
            ('Cactus', 'image4.jpg', '2023-06-02', user4, category1),  # Arshia: Succulents
            ('Snake Plant', 'image5.jpg', '2021-10-02', user2, category1),  # Darya: Succulents
            ('Fern', 'image6.jpg', '2023-03-12', user4, category2),  # Arshia: Ferns
            ('Rose', 'image7.jpg', '2023-01-01', user1, category3), #Lunaxx: Flowering Plants
            ('Orchid', 'image8.jpg', '2023-02-02', user3, category2) #Pardis: Ferns
        ]

        for plant_name, image, created_at, user, category in plant_data:
            plant = Plant(
                plant_name=plant_name,
                image=image,
                created_at=datetime.strptime(created_at, '%Y-%m-%d'),
                user=user,
                category=category
            )
            db.session.add(plant)
            print(f"Assigning Plant: {plant_name} | User ID: {user.id} | Category ID: {category.id}")

        db.session.commit()

        care_types = ["Watering", "Fertilizing", "Pruning", "Repotting"]

        for plant in Plant.query.all():
            for _ in range(3):
                care_note = CareNote(
                    care_type=rc(care_types),
                    frequency=randint(3, 14),
                    starting_date=datetime.now(),
                    next_care_date=datetime.now() + timedelta(days=randint(3, 14)),
                    custom_interval=randint(7, 30),
                    plant=plant
                )
                db.session.add(care_note)
        db.session.commit()

        print("Seeding complete!")