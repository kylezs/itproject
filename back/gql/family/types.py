from graphene_django import DjangoObjectType
from family.models import Family


class FamilyType(DjangoObjectType):
    class Meta:
        model = Family
        only_fields = (
            'id',
            'family_name',
            'about',
            'join_code',
            'family_members',
        )
