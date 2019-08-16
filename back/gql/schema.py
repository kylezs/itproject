from graphene import Argument, Field, ID, ObjectType, Schema
from graphene_django import DjangoConnectionField
from artefacts.models import Artefact
from .artefacts.types import ArtefactType
from graphene_django.filter import DjangoFilterConnectionField
from .artefacts.filters import ArtefactFilter
from .artefacts.mutations import ArtefactCreate, ArtefactDelete


class Query(ObjectType):
    artefacts = DjangoFilterConnectionField(ArtefactType,
                                            filterset_class=ArtefactFilter)

    artefact = Field(ArtefactType, id=Argument(ID, required=True))

    def resolve_artefacts(root, info, **kwargs):
        return Artefact.objects.all()

    def resolve_artefact(root, info, **kwargs):
        return Artefact.objects.get(id=kwargs.get('id'))


class Mutation(ObjectType):
    artefact_create = ArtefactCreate.Field()
    artefact_delete = ArtefactDelete.Field()


schema = Schema(query=Query, mutation=Mutation)
