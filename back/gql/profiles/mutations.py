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
        )


class UpdateProfile(SerializerMutation):
    class Meta:
        serializer_class = ProfileSerializer
        model_operations = ['update']
        lookup_field = 'id'
