# Generated by Django 2.2.4 on 2019-10-10 07:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0005_auto_20191010_1658'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='theme',
        ),
    ]