from graphene import Argument, Field, ID, ObjectType, Schema, List
from graphene_django import DjangoConnectionField
from graphene_django.filter import DjangoFilterConnectionField
# Artefacts
from artefacts.models import Artefact
from .artefacts.types import ArtefactType
from .artefacts.filters import ArtefactFilter
from .artefacts.mutations import ArtefactCreate, ArtefactDelete

# UserAuth
from .userAuth.types import UserType
from .userAuth.mutations import CreateUser
from django.contrib.auth import get_user_model


class Query(ObjectType):
    
    # ==== Artefact queries and resolvers ====
    artefacts = DjangoFilterConnectionField(ArtefactType,
                                            filterset_class=ArtefactFilter)

    artefact = Field(ArtefactType, id=Argument(ID, required=True))

    def resolve_artefacts(root, info, **kwargs):
        return Artefact.objects.all()

    def resolve_artefact(root, info, **kwargs):
        return Artefact.objects.get(id=kwargs.get('id'))

    # ==== User queries and resolvers ====
    users = List(UserType)

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()


class Mutation(ObjectType):
    artefact_create = ArtefactCreate.Field()
    artefact_delete = ArtefactDelete.Field()
    create_user = CreateUser.Field()


schema = Schema(query=Query, mutation=Mutation)
