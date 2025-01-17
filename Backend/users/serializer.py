from rest_framework import serializers

from .models import Accounts

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounts
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    
class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()