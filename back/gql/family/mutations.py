from graphene_django.rest_framework.mutation import SerializerMutation
from graphene import Field, ID, InputObjectType, Mutation, String
from rest_framework import serializers
from family.models import Family
from .types import FamilyType


class FamilyInputType(InputObjectType):
    family_name = String()
    about = String(required=False)


class FamilyCreate(Mutation):
    class Arguments:
        input = FamilyInputType(required=True)

    family = Field(FamilyType)

    @classmethod
    def mutate(cls, root, info, **data):
        user = info.context.user
        input = data.get('input')
        family = Family(
            family_name=input.family_name,
            about=input.about,
            family_admin=user
        )
        family.save()
        return FamilyCreate(family=family)