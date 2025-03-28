"""Initial migration

Revision ID: 21a3f4599e2a
Revises: 
Create Date: 2025-03-28 12:08:20.664776

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '21a3f4599e2a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category_name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('plants',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('plant_name', sa.String(length=100), nullable=False),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], name=op.f('fk_plants_category_id_categories')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_plants_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('care_notes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('care_type', sa.String(length=100), nullable=False),
    sa.Column('frequency', sa.Integer(), nullable=True),
    sa.Column('starting_date', sa.Date(), nullable=False),
    sa.Column('next_care_date', sa.Date(), nullable=False),
    sa.Column('custom_interval', sa.Integer(), nullable=True),
    sa.Column('plant_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['plant_id'], ['plants.id'], name=op.f('fk_care_notes_plant_id_plants')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('care_notes')
    op.drop_table('plants')
    op.drop_table('users')
    op.drop_table('categories')
    # ### end Alembic commands ###
