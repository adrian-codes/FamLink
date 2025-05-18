"""Make admin_id nullable in families

Revision ID: 9b1eeb70a562
Revises: 6494842c9b77
Create Date: 2025-05-15 19:00:20.141238

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '9b1eeb70a562'
down_revision: Union[str, None] = '6494842c9b77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # Make admin_id nullable
    op.alter_column('families', 'admin_id', existing_type=sa.INTEGER(), nullable=True)

def downgrade() -> None:
    """Downgrade schema."""
    # Revert admin_id to not nullable (ensure no null values exist before applying)
    op.alter_column('families', 'admin_id', existing_type=sa.INTEGER(), nullable=False)