from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializerV1(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password', 'first_name', 'last_name', 'email', 
            'birthdate', 'gender','id_profile_img', 'profile_img_path', 'is_active'
        )
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'birthdate': {'required': True},
            'gender': {'required': True}
        }
        
    # Update user with hashed password
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class EmailSerializerV1(serializers.Serializer):
    email = serializers.EmailField()