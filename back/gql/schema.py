from graphene import Argument, Field, ID, ObjectType, Schema, List
import graphql_jwt
from graphene_django import DjangoConnectionField
from graphene_django.filter import DjangoFilterConnectionField
from .errors import *

# Artefacts
from artefacts.models import Artefact
from .artefacts.types import ArtefactType
from .artefacts.filters import ArtefactFilter
from .artefacts.mutations import ArtefactCreate, ArtefactUpdate, ArtefactDelete

# UserAuth
from .userAuth.types import UserType
from .userAuth.mutations import CreateUser
from django.contrib.auth import get_user_model

# User Profile
from .profiles.types import ProfileType
from .profiles.mutations import UpdateProfile

# Family
from family.models import Family
from .family.types import FamilyType
from .family.mutations import FamilyCreate, FamilyJoin


class Query(ObjectType):

    # ==== Artefact queries and resolvers ====
    artefacts = DjangoFilterConnectionField(ArtefactType,
                                            filterset_class=ArtefactFilter)

    artefact = Field(ArtefactType, id=Argument(ID, required=True))


    def resolve_artefacts(root, info, **kwargs):
        user = info.context.user
        if user.is_superuser:
            return Artefact.objects.all()
        else:
            raise Exception(AUTH_EXCEPTION)

    def resolve_artefact(root, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        user_families = Family.objects.filter(family_members__username=user.username)
        artefact = Artefact.objects.get(id=kwargs.get('id'))
        artefact_families = artefact.belongs_to_families.all()
        if (set(user_families) & set(artefact_families)) or artefact.is_public or artefact.admin == user:
            return artefact
        else:
            raise Exception(AUTH_EXCEPTION)

    # ==== User queries and resolvers ====
    users = List(UserType)

    user = Field(UserType, id=Argument(ID, required=True))

    me = Field(UserType)

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()

    ## NEEDS TO BE FIXED FOR USER PROFILES, QUERY BY ID
    def resolve_user(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        return user

    def resolve_me(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        return user

    # ==== Family queries and resolvers ====
    # get all families
    family = Field(FamilyType, id=Argument(ID, required=True))

    families = List(FamilyType)

    def resolve_family(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception(AUTH_EXCEPTION)

        family = Family.objects.get(id=kwargs.get('id'))
        user_in_family = user in family.family_members.all()

        if user.is_superuser or family.family_admin == user or user_in_family:
            return family
        else:
            raise Exception(AUTH_EXCEPTION)


    def resolve_families(self, info, **kwargs):
        user = info.context.user
        print("requesting user: " + user.username)
        return Family.objects.all()


class Mutation(ObjectType):
    # ==== Artefact mutations ====
    artefact_create = ArtefactCreate.Field()
    artefact_update = ArtefactUpdate.Field()
    artefact_delete = ArtefactDelete.Field()

    # ==== UserAuth mutations ====
    create_user = CreateUser.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    # ==== User Profile mutation ====
    update_profile = UpdateProfile.Field()

    # ==== Family mutation ====
    # Update and create
    family_create = FamilyCreate.Field()
    family_join = FamilyJoin.Field()



schema = Schema(query=Query, mutation=Mutation)
