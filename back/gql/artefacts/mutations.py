from graphene import Boolean, Field, ID, InputObjectType, Mutation, String, List, Float
from rest_framework import serializers
from graphene_django.rest_framework.mutation import SerializerMutation
from artefacts.models import Artefact
from .types import ArtefactType
from ..family.types import Family
from gql.errors import *


class ArtefactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artefact
        fields = (
            'id',
            'name',
            'description',
            'admin',
            'date',
            'state',
            'is_public',
            'upload',
            'belongs_to_families',
            'location',
        )


class ArtefactInputType(InputObjectType):
    name = String()
    description = String()
    state = String()
    is_public = Boolean()
    belongs_to_families = List(ID)
    location = List(Float)
    location_type = String()


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

        family_ids = input.belongs_to_families
        families = Family.objects.filter(id__in=family_ids)

        artefact = Artefact(
            name=input.name,
            description=input.description,
            state=input.state,
            is_public=input.is_public,
            admin=user,
            location=input.location,
            location_type=input.location_type
        )
        # Create the artefact so it has an id to be used for ManyToMany
        artefact.save()

        # ManyToMany can do direct assignment so do it this way
        artefact.belongs_to_families.set(families)

        return ArtefactCreate(artefact=artefact)


class ArtefactUpdate(Mutation):
    class Arguments:
        id = ID(required=True)
        input = ArtefactInputType(required=True)

    artefact = Field(ArtefactType)

    @classmethod
    def mutate(cls, root, info, **data):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)
        id = data.get("id")
        input = data.get("input")
        # returns a list of at most one item, since query by pk
        instance = Artefact.objects.filter(pk=id, admin=user).first()
        if instance:
            serializer = ArtefactSerializer(instance=instance, data=input,
                                            partial=True)
            serializer.is_valid(raise_exception=True)
            return ArtefactUpdate(artefact=serializer.save())
        else:
            raise Exception(AUTH_EXCEPTION)


class ArtefactDelete(Mutation):
    class Arguments:
        id = ID(required=True)

    ok = Boolean()

    @classmethod
    def mutate(cls, root, info, **data):
        artefact = Artefact.objects.get(id=data.get('id'))
        artefact.delete()

        return ArtefactDelete(ok=True)
