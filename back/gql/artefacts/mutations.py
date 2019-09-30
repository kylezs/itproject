from graphene import Boolean, Field, ID, InputObjectType, Mutation, String, List
from rest_framework import serializers
from artefacts.models import Artefact
from .types import ArtefactType
from ..family.types import Family
from gql.errors import *


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
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        input = data.get('input')
        
        artefact = Artefact(
            name=input.name,
            description=input.description,
            state=input.state,
            is_public=input.is_public,
            admin=user
        )

        artefact.save()

        return ArtefactCreate(artefact=artefact)


class ArtefactDelete(Mutation):
    class Arguments:
        id = ID(required=True)

    ok = Boolean()

    @classmethod
    def mutate(cls, root, info, **data):
        artefact = Artefact.objects.get(id=data.get('id'))
        artefact.delete()

        return ArtefactDelete(ok=True)
