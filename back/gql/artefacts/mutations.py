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
            'added_at',
            'date',
            'artefact_flag_choices',
            'is_public',
            'belong_to_family', 
            'upload',
            'added_at',
            'location',
        )


class ArtefactInputType(InputObjectType):
    name = String()
    description = String()
    artefact_flag_choices = String()
    is_public = Boolean()
    upload = String()
    location = String()


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
            artefact_admin=user
        )
        
        #family.save()
        artefact.save()
        #return FamilyCreate(family=family)
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
