"""
@author Kyle Zsembery
"""

from graphene_django.rest_framework.mutation import SerializerMutation
from graphene import Field, ID, InputObjectType, Mutation, String
from rest_framework import serializers
from family.models import Family
from .types import FamilyType
from userprofile.models import Profile
from django.contrib.auth.models import User


from gql.errors import *

# These are the only two fields required as input to create a family
# The rest are added through other means e.g. joining a family
# or auto-assigned family admin
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

        # Default the selected family to the one being created if the
        # user does not have a family selected already
        if not user.profile.selected_family:
            user.profile.selected_family = family
        user.save()

        family.family_members.set([user])
        
        return FamilyCreate(family=family)


# Used when someone enters the join code to join a family
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

        # Default the selected family to the one being joined if the
        # user does not have a family selected already
        if not user.profile.selected_family:
            user.profile.selected_family = to_join
        user.profile.save()

        return FamilyJoin(family=to_join)
