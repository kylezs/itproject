from graphene_django.rest_framework.mutation import SerializerMutation
from graphene import Field, ID, InputObjectType, Mutation, String
from rest_framework import serializers
from family.models import Family
from .types import FamilyType

from gql.errors import *


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
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)
        input = data.get('input')

        family = Family(
            family_name=input.family_name,
            about=input.about,
            family_admin=user
        )

        family.save()

        family.family_members.set([user])
        
        return FamilyCreate(family=family)

class FamilyJoin(Mutation):
    class Arguments:
        joinCode = String(required=True)
    
    family = Field(FamilyType)

    @classmethod
    def mutate(cls, root, info, **data):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        # there should only ever be one family with a join code, but filter
        # and not get, means it won't crash
        to_join = Family.objects.filter(join_code=data.get("joinCode"))[0]

        to_join.family_members.add(user)

        return FamilyJoin(family=to_join)
