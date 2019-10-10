# Generated by Django 2.2.4 on 2019-10-10 04:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0003_auto_20191010_1521'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artefact',
            name='belongs_to_families',
            field=models.ManyToManyField(related_name='has_artefacts', to='family.Family'),
        ),
    ]
