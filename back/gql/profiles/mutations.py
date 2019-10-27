"""
@author Kyle Zsembery
"""


from graphene_django.rest_framework.mutation import SerializerMutation
from rest_framework import serializers
from userprofile.models import Profile
from .types import ProfileType


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'id',
            'bio',
            'birth_date',
            'selected_family',
        )

# Use the built in update serializer, using "id" as the unique
# identifier for the object being updated
class UpdateProfile(SerializerMutation):
    class Meta:
        serializer_class = ProfileSerializer
        model_operations = ['update']
        lookup_field = 'id'
