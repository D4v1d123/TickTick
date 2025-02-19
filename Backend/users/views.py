from django.contrib.auth import get_user_model
from rest_framework import views

import cloudinary.uploader as cloudinary
from .models import Accounts
from .serializer import EmailSerializerV1, UserSerializerV1
from .services.responses import *
from .services.validations import *


class CheckUniqueUsernameAPIView(views.APIView):
    def post(self, request, version):
        try:
            if version == 'v1':
                username = request.data.get('username')        
                serializer = EmailSerializerV1(data={'email': username})
                
                if not serializer.is_valid():
                    return incorrect_username_response()

                username_exists = Accounts.objects.values('username').filter(username=username).exists()
                return username_available_response(not(username_exists))
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)


class UserAPIView(views.APIView):
    # Cloudinary settings
    IMG_FORMAT = 'AVIF'
    UPLOAD_FOLDER = 'profile_pictures_tick_tick'
    
    User = get_user_model()
    type_images = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/svg+xml', 
        'image/heic', 
        'image/heif'
    ]
    
    def get(self, request, version, id_user=None):
        try:
            if version == 'v1':
                accounts = Accounts.objects.all().filter(is_active=True)

                if id_user:
                    account = accounts.filter(id=id_user).first()

                    if account:
                        serializer = UserSerializerV1(account)
                        return serializer_data_response(serializer)
                    return user_not_found_response()

                serializer = UserSerializerV1(accounts, many=True)
                return serializer_data_response(serializer)
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)
        
    def post(self, request, version):
        try:
            if version == 'v1':
                accounts = Accounts.objects.all()
                data = request.POST.copy()
                file = request.data.get('file')
                file_type = getattr(file, 'content_type', None)
                
                if accounts.filter(username=data.get('username')).exists():
                    return registered_email_response()

                # Check if the request has an unsupported image type 
                if file and not(file_type in self.type_images):
                    return unsupported_image_response()
            
                user_data = {
                    'username': data.get('username'), 
                    'password': data.get('password'), 
                    'first_name': data.get('first_name'), 
                    'last_name': data.get('last_name'), 
                    'birthdate': data.get('birthdate'), 
                    'gender': data.get('gender'),
                    'email': data.get('email')
                }
                
                serializer = UserSerializerV1(data=user_data)
                
                if serializer.is_valid():
                    errors = validate_field_data(request)
                    
                    if errors:
                        return invalid_data_response(errors)
                    
                    if file:
                        upload_result = cloudinary.upload(
                            file, format=self.IMG_FORMAT, folder=self.UPLOAD_FOLDER
                        )
                        user_data.update({
                            'id_profile_img': upload_result['public_id'],
                            'profile_img_path': upload_result['secure_url']
                        })
                        
                    # Create user
                    user = self.User.objects.create_user(**user_data)
                    return serializer_data_response(UserSerializerV1(user))
                return serializer_error_response(serializer)
            return invalid_version_response()
        except Exception as error: 
            return generic_error_response(error)

    def put(self, request, version, id_user):
        try:
            if version == 'v1':
                account = Accounts.objects.all().filter(id=id_user).first()
                data = request.POST.copy()
                file = request.data.get('file')
                file_type = getattr(file, 'content_type', None)
                
                if not('is_active' in data):
                    return required_field_response('is_active')
                
                if not(file):
                    return required_field_response('file')
                
                # Check if the request has an unsupported image type 
                if (file != 'Null') and not(file_type in self.type_images):
                    return unsupported_image_response()
                
                if account:
                    serializer = UserSerializerV1(account, data) 
                    
                    if serializer.is_valid():
                        errors = validate_field_data(request)
                    
                        if errors:
                            return invalid_data_response(errors)
                        
                        # Delete registered profile photo from account
                        if account.id_profile_img:
                            cloudinary.destroy(account.id_profile_img)
                            data['id_profile_img'] = None
                            data['profile_img_path'] = None

                        # Update account profile photo 
                        if file != 'Null':
                            upload_result = cloudinary.upload(
                                file, format=self.IMG_FORMAT, folder=self.UPLOAD_FOLDER
                            )
                            data['id_profile_img'] = upload_result['public_id']
                            data['profile_img_path'] = upload_result['secure_url']

                        # Update serializer with image upload data
                        serializer = UserSerializerV1(account, data) 
                        serializer.is_valid()
                        serializer.save()
                        return serializer_data_response(serializer)
                    return serializer_error_response(serializer)
                return user_not_found_response()
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)
    
    def patch(self, request, version, id_user):
        try:
            if version == 'v1':
                account = Accounts.objects.all().filter(id=id_user).first()
                data = request.POST.copy()
                file = request.data.get('file')
                file_type = getattr(file, 'content_type', None)
                
                # Check if the request has an unsupported image type 
                if file and (file != 'Null') and not(file_type in self.type_images):
                    return unsupported_image_response()

                if account:
                    serializer = UserSerializerV1(account, data, partial=True) 

                    if serializer.is_valid():
                        errors = validate_field_data(request)
                    
                        if errors:
                            return invalid_data_response(errors)
                        
                        # Delete registered profile photo from account
                        if (file == 'Null') and account.id_profile_img:
                            cloudinary.destroy(account.id_profile_img)
                            data['id_profile_img'] = None
                            data['profile_img_path'] = None

                        # Update account profile photo 
                        if file and (file != 'Null'):
                            if account.id_profile_img:
                                cloudinary.destroy(account.id_profile_img)

                            upload_result = cloudinary.upload(
                                file, format=self.IMG_FORMAT, folder=self.UPLOAD_FOLDER
                            )
                            data['id_profile_img'] = upload_result['public_id']
                            data['profile_img_path'] = upload_result['secure_url']

                        # Update serializer with image upload data
                        serializer = UserSerializerV1(account, data, partial=True) 
                        serializer.is_valid()
                        serializer.save()
                        return serializer_data_response(serializer)
                    return serializer_error_response(serializer)
                return user_not_found_response()
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)
        
    def delete(self, request, version, id_user):
        try:
            if version == 'v1':
                account = Accounts.objects.all().filter(id=id_user).first()

                if account:
                    serializer = UserSerializerV1(account, {'is_active': False}, partial=True)
                    serializer.is_valid()
                    serializer.save()
                    return serializer_data_response(serializer)
                return user_not_found_response()
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)