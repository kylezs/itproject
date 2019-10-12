# Generated by Django 2.2.4 on 2019-10-10 04:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0002_profile_dark_mode'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='dark_mode',
        ),
        migrations.AddField(
            model_name='profile',
            name='theme',
            field=models.TextField(default='light'),
        ),
    ]