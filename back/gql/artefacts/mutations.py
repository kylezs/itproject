from graphene import Boolean, Field, ID, InputObjectType, Mutation, String
from rest_framework import serializers
from artefacts.models import Artefact
from .types import ArtefactType


class ArtefactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artefact
        fields = (
            'id',
            'name',
            'description',
            'test', # test
            'date',
            'LostOrDamaged',
            'isPublic',
        )


class ArtefactInputType(InputObjectType):
    name = String()
    description = String()
    test = String() # test
    LostOrDamaged = Boolean()
    isPublic = Boolean()


class ArtefactCreate(Mutation):
    class Arguments:
        input = ArtefactInputType(required=True)

    artefact = Field(ArtefactType)

    @classmethod
    def mutate(cls, root, info, **data):
        serializer = ArtefactSerializer(data=data.get('input'))
        serializer.is_valid(raise_exception=True)

        return ArtefactCreate(artefact=serializer.save())


class ArtefactDelete(Mutation):
    class Arguments:
        id = ID(required=True)

    ok = Boolean()

    @classmethod
    def mutate(cls, root, info, **data):
        artefact = Artefact.objects.get(id=data.get('id'))
        artefact.delete()

        return ArtefactDelete(ok=True)
