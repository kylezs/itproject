from graphene_django.rest_framework.mutation import SerializerMutation
from graphene import Field, ID, InputObjectType, Mutation, String
from rest_framework import serializers
from family.models import Family
from .types import FamilyType


# class FamilySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Family
#         # Only the fields being submitted
#         fields = (
#             'id',
#             'family_name',
#             'about',
#         )


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


# class FamilyMutations(SerializerMutation):

#     class Meta:
#         serializer_class = FamilySerializer
#         model_operations = ['create', 'update']
#         lookup_field = 'id'

#     @staticmethod
#     def mutate(root, info, person_data=None):
#         person = Person(
#             name=person_data.name,
#             age=person_data.age
#         )
#         return CreatePerson(person=person)
