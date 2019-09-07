from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from userprofile.models import Profile
import uuid


# NB: You may need to update the graphql logic if you are updating this
class Family(models.Model):
    family_name = models.CharField(max_length=150)
    family_admin = models.ForeignKey(get_user_model(),
                                     on_delete=models.SET_NULL, null=True,
                                     related_name="administrator_of")
    about = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    join_code = models.UUIDField(unique=True, default=uuid.uuid4)
    family_members = models.ManyToManyField(get_user_model(),
                                            related_name="is_member_of")

    class Meta:
        verbose_name = _('family')
        verbose_name_plural = _('families')
        ordering = ('-created_at', )

    def __str__(self):
        # NB: Pk is a unique identifier. It is automatically assigned to every
        # created object
        return '{} (#{})'.format(self.family_name, self.pk)
