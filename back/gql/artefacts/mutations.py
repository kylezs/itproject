"""
Define the mutations (C, U, D of CRUD) for artefacts
@author Kyle Zsembery, King Wai Theng
"""

from graphene import Boolean, Field, ID, InputObjectType, Mutation, String, List, Float, Scalar
from graphene.types.datetime import Date
from rest_framework import serializers
from graphene_django.rest_framework.mutation import SerializerMutation
from artefacts.models import Artefact
from .types import ArtefactType
from ..family.types import Family
from gql.errors import *
import datetime


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
            'address',
        )


class ArtefactInputType(InputObjectType):
    name = String()
    description = String()
    state = String()
    is_public = Boolean()
    belongs_to_families = List(ID)
    address = String()
    date = String()

# For file uploads


class Upload(Scalar):
    def serialize(self):
        pass


class ArtefactCreate(Mutation):
    class Arguments:
        input = ArtefactInputType(required=True)
        item_image = Upload()

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
            admin=user,
            address=input.address,
            date=input.date
        )

        # image file upload (see item_image = Upload() above)
        if info.context.FILES and info.context.method == 'POST':
            thefile = info.context.FILES['itemImage']
            artefact.upload = thefile


        # Create the artefact so it has an id to be used for ManyToMany
        artefact.save()

        # ManyToMany can't do direct assignment so do it this way
        family_ids = input.belongs_to_families
        if family_ids:
            families = Family.objects.filter(id__in=family_ids)
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
        user = info.context.user
        if user.is_anonymous:
            raise(AUTH_EXCEPTION)
        
        artefact = Artefact.objects.get(id=data.get('id'))
        if artefact.admin == user:
            artefact.delete()
            return ArtefactDelete(ok=True)
        else:
            raise(AUTH_EXCEPTION)
