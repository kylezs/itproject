from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from datetime import datetime
from family.models import Family
from mapbox_location_field.models import LocationField


# NB: You may need to update the graphql logic if you are updating this
class Artefact(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField()

    # adapted from family models.py
    artefact_admin = models.ForeignKey(get_user_model(),
                                    on_delete=models.SET_NULL, null=True,
                                    related_name="artefact_administrator_of")

    # test field now: later, override __init__ to update this whenever a field changes.
    # also, used timezone.now() for migration when prompted default value.. change later
    date = models.DateTimeField(auto_now=True) 

    artefact_flag_choices = [
        ('OKY', 'No Problem'),
        ('LST', 'Lost'),
        ('DMG', 'Damaged'),
        ('DST', 'Destroyed'),
    ]
    artefact_flag_choices = models.CharField(
        max_length=9,
        choices=artefact_flag_choices,
        default='OKY'
    )
    is_public = models.BooleanField(default=False)

    # belong to multiply families
    belong_to_family = models.ForeignKey(Family, on_delete=models.CASCADE, null=True)

    # upload image file to AWS S3 bucket
    upload = models.FileField(default=False)

    added_at = models.DateTimeField(auto_now_add=True)

    # location service provided by mapbox
    location = LocationField(null=True)

    class Meta:
        verbose_name = _('artefact')
        verbose_name_plural = _('artefacts')
        ordering = ('-added_at', )

    def __str__(self):
        # NB: Pk is a unique identifier. It is automatically assigned to every
        # created object
        return '{} (#{})'.format(self.name, self.pk)