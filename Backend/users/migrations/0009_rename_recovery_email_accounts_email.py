# Generated by Django 5.1.5 on 2025-02-17 04:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_rename_email_accounts_username'),
    ]

    operations = [
        migrations.RenameField(
            model_name='accounts',
            old_name='recovery_email',
            new_name='email',
        ),
    ]
