from graphene import Argument, Field, ID, ObjectType, Schema, List
import graphql_jwt
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

# User Profile
from .profiles.types import ProfileType
from .profiles.mutations import UpdateProfile


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

    user = Field(UserType)

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()

    def resolve_user(self, info, **kwargs):
        user = info.context.user
        print("hello, this is the user: " + user.username)
        if user.is_anonymous:
            raise Exception("Not Logged in!")

        return user


class Mutation(ObjectType):
    # ==== Artefact mutations ====
    artefact_create = ArtefactCreate.Field()
    artefact_delete = ArtefactDelete.Field()

    # ==== UserAuth mutations ====
    create_user = CreateUser.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    # ==== User Profile mutation ====
    update_profile = UpdateProfile.Field()


schema = Schema(query=Query, mutation=Mutation)
