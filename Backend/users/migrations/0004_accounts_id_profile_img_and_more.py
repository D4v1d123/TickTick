# Generated by Django 5.1.5 on 2025-02-02 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_accounts_profile_img_path'),
    ]

    operations = [
        migrations.AddField(
            model_name='accounts',
            name='id_profile_img',
            field=models.CharField(null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='accounts',
            name='profile_img_path',
            field=models.URLField(null=True),
        ),
    ]
