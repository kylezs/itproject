"""
Return type of a family
@author Kyle Zsembery
"""

from graphene_django import DjangoObjectType
from family.models import Family


class FamilyType(DjangoObjectType):
    class Meta:
        model = Family
        only_fields = (
            'id',
            'family_name',
            'family_admin',
            'about',
            'join_code',
            'family_members',
            'has_artefacts'
        )
