from django.db import models

class UserGroups(models.Model):
    name = models.CharField(max_length=100)

    
class Accounts(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birthdate = models.DateField(null=False)
    gender = models.CharField(max_length=20)
    recovery_email = models.CharField(max_length=50)
    id_profile_img = models.CharField(unique=True, null=True)
    profile_img_path = models.URLField(null=True)
    
    def save(self, *args, **kwargs):
        if self.first_name:
            self.first_name = self.first_name.title()
        
        if self.last_name:
            self.last_name = self.last_name.title()
            
        if self.gender:
            self.gender = self.gender.lower()
            
        super().save(*args, **kwargs)


class UsersGroupAccounts(models.Model):
    user_groups = models.ForeignKey('UserGroups', on_delete=models.CASCADE)
    account = models.ForeignKey('Accounts', on_delete=models.CASCADE)
