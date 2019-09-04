from graphene_django import DjangoObjectType
from userprofile.models import Profile


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile
        only_fields = (
            'id',
            'user',
            'bio',
            'birth_date',
        )
