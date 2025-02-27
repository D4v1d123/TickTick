from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.db import models


class UserGroups(models.Model):
    name = models.CharField(max_length=100)

    
class Accounts(AbstractUser):
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birthdate = models.DateField(null=False)
    gender = models.CharField(max_length=20)
    email = models.EmailField(max_length=50)
    id_profile_img = models.CharField(unique=True, null=True)
    profile_img_path = models.URLField(null=True)
    update_date = models.DateTimeField(auto_now=True, null=True)
    
    def save(self, *args, **kwargs):
        self.first_name = self.first_name.title().strip()
        self.last_name = self.last_name.title().strip()
        self.gender = self.gender.lower().strip()
        self.update_date = now()
            
        super().save(*args, **kwargs)


class UsersGroupAccounts(models.Model):
    user_groups = models.ForeignKey('UserGroups', on_delete=models.CASCADE)
    account = models.ForeignKey('Accounts', on_delete=models.CASCADE)