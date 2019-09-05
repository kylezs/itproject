from django.db import models
from django.utils.translation import ugettext_lazy as _
from datetime import datetime


# NB: You may need to update the graphql logic if you are updating this
class Artefact(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField()

    

    # test field now: later, override __init__ to update this whenever a field changes.
    # also, used timezone.now() for migration when prompted default value.. change later
    date = models.DateTimeField(auto_now=True) 

    LostOrDamaged = models.BooleanField(default=False)
    isPublic = models.BooleanField(default=False)
    # test variable
    test = models.TextField(default='')

    
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('artefact')
        verbose_name_plural = _('artefacts')
        ordering = ('-added_at', )

    def __str__(self):
        # NB: Pk is a unique identifier. It is automatically assigned to every
        # created object
        return '{} (#{})'.format(self.name, self.pk)
