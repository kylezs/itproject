# Generated by Django 2.2.4 on 2019-10-15 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0003_auto_20191016_1013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artefact',
            name='date',
            field=models.DateTimeField(null=True),
        ),
    ]
