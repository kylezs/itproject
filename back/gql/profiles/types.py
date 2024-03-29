"""
Return type for profile
@author Kyle Zsembery
"""

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
            'selected_family',
        )
