# Generated by Django 2.2.4 on 2019-10-11 05:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        # ('artefacts', '0013_auto_20191011_1631'),
    ]

    operations = [
        migrations.RenameField(
            model_name='artefact',
            old_name='location',
            new_name='address',
        ),
    ]