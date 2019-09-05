from graphene_django.rest_framework.mutation import SerializerMutation
from rest_framework import serializers
from family.models import Family
from .types import ProfileType


class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        # Only the fields being submitted
        fields = (
            'id',
            'family_name',
            'about',
        )


class FamilyMutations(SerializerMutation):
    class Meta:
        serializer_class = FamilySerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'
