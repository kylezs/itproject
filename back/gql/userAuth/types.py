from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType


# NB: No corresponding Django app, just handled by built-in django auth
class UserType(DjangoObjectType):

    class Meta:
        # use django's builtin user model
        model = get_user_model()
