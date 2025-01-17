from rest_framework import serializers

from .models import Accounts

class UserSerializerV1(serializers.ModelSerializer):
    class Meta:
        model = Accounts
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    
class EmailSerializerV1(serializers.Serializer):
    email = serializers.EmailField()