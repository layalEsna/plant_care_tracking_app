#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta, timezone

# Local imports
from app import app
# from server.app import app

from models import db, User, Category, Plant, CareNote

UTC = timezone.utc

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Drop all existing tables and create new ones
        db.drop_all()
        db.create_all()

        # Seed users
        user1 = User(username='Lunaxx')
        user1.password = 'Ddddddddd!'

        user2 = User(username='Darya')
        user2.password = 'Ddddddddd!'

        user3 = User(username='Pardis')
        user3.password = 'Ddddddddd!'

        user4 = User(username='Arshia')
        user4.password = 'Ddddddddd!'

        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.add(user4)
        db.session.commit()

        # Seed categories
        category1 = Category(category_name='Succulents')
        category2 = Category(category_name='Ferns')
        category3 = Category(category_name='Flowering Plants')
        
        db.session.add(category1)
        db.session.add(category2)
        db.session.add(category3)
        db.session.commit()

        # Seed plants
        plant_data = [
            ('Aloe Vera', 'image1.jpg', '2023-03-02', 1, 2),
            ('Spider Plant', 'image2.jpg', '2023-06-02', 2, 2),
            ('Peace Lily', 'image3.jpg', '2024-03-02', 4, 3),
            ('Cactus', 'image4.jpg', '2023-06-02', 3, 3),
            ('Snake Plant', 'image5.jpg', '2021-10-02', 2, 1),
            ('Fern', 'image6.jpg', '2023-03-12', 4, 2)
        ]

        plants = []
        for plant_name, image, created_at, user_id, category_id in plant_data:
            plant = Plant(
                plant_name=plant_name,
                image=image,
                created_at=datetime.strptime(created_at, '%Y-%m-%d'),
                user_id=user_id,
                category_id=category_id
            )
            plants.append(plant)
            db.session.add(plant)
        db.session.commit()

        # Seed CareNotes
        care_types = ["Watering", "Fertilizing", "Pruning", "Repotting"]

        for plant in Plant.query.all():
            for _ in range(3):  # Each plant gets 3 care notes
                care_note = CareNote(
                    care_type=rc(care_types),
                    frequency=randint(3, 14),
                    starting_date=datetime.now(UTC),
                    next_care_date=datetime.now(UTC) + timedelta(days=randint(3, 14)),
                    custom_interval=randint(7, 30),
                    plant_id=plant.id
                )
                db.session.add(care_note)
        db.session.commit()

        print("Seeding complete!")
