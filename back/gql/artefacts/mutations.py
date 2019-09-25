from graphene import Boolean, Field, ID, InputObjectType, Mutation, String, List
from rest_framework import serializers
from artefacts.models import Artefact
from .types import ArtefactType
from ..family.types import Family


class ArtefactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artefact
        fields = (
            'name',
            'description',
            'is_public',
            'state'
        )


class ArtefactInputType(InputObjectType):
    name = String()
    description = String()
    state = String()
    is_public = Boolean()


class ArtefactCreate(Mutation):
    class Arguments:
        input = ArtefactInputType(required=True)

    artefact = Field(ArtefactType)

    @classmethod
    def mutate(cls, root, info, **data):
        serializer = ArtefactSerializer(data=data.get('input'))
        serializer.is_valid(raise_exception=True)

        user = info.context.user
        input = data.get('input')
        artefact = Artefact(
            admin=user,
        )

        artefact.save()

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
