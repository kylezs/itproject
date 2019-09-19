# Generated by Django 2.2.4 on 2019-09-18 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0012_artefact_artefact_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artefact',
            name='artifact_flag_choices',
            field=models.CharField(choices=[('OKY', 'No Problem'), ('LST', 'Lost'), ('DMG', 'Damaged'), ('DST', 'Destroyed')], default='OKY', max_length=9),
        ),
    ]
