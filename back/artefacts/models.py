from django.db import models
from django.utils.translation import ugettext_lazy as _


class Artefact(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('artefact')
        verbose_name_plural = _('artefacts')
        ordering = ('-added_at', )

    def __str__(self):
        # NB: Pk is a unique identifier. It is automatically assigned to every
        # created object
        return '{} (#{})'.format(self.title, self.pk)
