# Generated by Django 2.2.4 on 2019-09-19 01:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0013_auto_20190918_1727'),
    ]

    operations = [
        migrations.RenameField(
            model_name='artefact',
            old_name='artifact_flag_choices',
            new_name='artefact_state',
        ),
        migrations.RemoveField(
            model_name='artefact',
            name='information_on_handling',
        ),
    ]
