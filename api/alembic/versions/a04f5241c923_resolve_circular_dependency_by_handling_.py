"""Resolve circular dependency by handling admin_id constraint

Revision ID: <revision_id>
Revises: 9b1eeb70a562
Create Date: 2025-05-15 19:40:00.123456

"""
from alembic import op
import sqlalchemy as sa

revision = '<revision_id>'
down_revision = '9b1eeb70a562'
branch_labels = None
depends_on = None

def upgrade():
    # Drop the foreign key constraint on admin_id
    op.drop_constraint('families_admin_id_fkey', 'families', type_='foreignkey')
    # Recreate the foreign key constraint
    op.create_foreign_key('families_admin_id_fkey', 'families', 'users', ['admin_id'], ['id'])

def downgrade():
    # Drop the foreign key constraint
    op.drop_constraint('families_admin_id_fkey', 'families', type_='foreignkey')
    # Recreate the foreign key constraint (original state)
    op.create_foreign_key('families_admin_id_fkey', 'families', 'users', ['admin_id'], ['id'])