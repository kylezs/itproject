"""
Defines a user profile model, that acts as user settings too
@author Kyle Zsembery
"""


from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _


# This class handles everything about the user that's not authentication later
# Some fields, such as firstname and lastname are handled already by Django, so
# we just let Django handle them
# NB: You may need to update the graphql logic if you are updating this
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(max_length=600, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    # Holds the family to be displayed at any point in time for this user
    selected_family = models.ForeignKey("family.Family",
                                        on_delete=models.SET_NULL,
                                        null=True)

    # TODO: Profile picture

    class Meta:
        verbose_name = _('profile')
        verbose_name_plural = _('profiles')

    def __str__(self):
        # NB: Pk is a unique identifier. It is automatically assigned to every
        # created object
        return '{} (#{})'.format(self.user.username, self.pk)


# These methods creates a profile when a user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
