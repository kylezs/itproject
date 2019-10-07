from django.contrib import admin
from .models import Artefact
from mapbox_location_field.admin import MapAdmin

admin.site.register(Artefact, MapAdmin)
