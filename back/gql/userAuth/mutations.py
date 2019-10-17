from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType
from .types import UserType


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    # username is the field that acts as a pseudo-primary key
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        firstname = graphene.String()
        lastname = graphene.String()


    def mutate(self, info, username, password, email, firstname, lastname):
        user = get_user_model()(
            username=username,
            email=email,
            first_name=firstname,
            last_name=lastname
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)
