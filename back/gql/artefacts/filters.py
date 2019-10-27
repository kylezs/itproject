"""
Define a search filter for artefacts
@author Kyle Zsembery
"""

from django.db.models import Q
import django_filters
from artefacts.models import Artefact


class ArtefactFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Artefact
        fields = ()

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )
