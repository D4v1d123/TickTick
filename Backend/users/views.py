from rest_framework import status, views
from rest_framework.response import Response

import cloudinary.uploader as cloudinary
from .models import Accounts
from .serializer import EmailSerializerV1, UserSerializerV1
from .services import *


class CheckUniqueEmailAPIView(views.APIView):
    def post(self, request, version):
        try:
            if version == 'v1':
                email = request.data.get('email')        
                serializer = EmailSerializerV1(data={'email': email})
                
                if not serializer.is_valid():
                    return incorrect_email_response()

                email_exists = Accounts.objects.values('email').filter(email=email).exists()
                return email_available_response(not(email_exists))
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)


class UserAPIView(views.APIView):
    # Cloudinary settings
    IMG_FORMAT = 'AVIF'
    UPLOAD_FOLDER = 'profile_pictures_tick_tick'
    
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
                accounts = Accounts.objects.all()

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
                id_profile_img = data.get('id_profile_img')
                profile_img_path = data.get('profile_img_path')

                if accounts.filter(email=data.get('email')).exists():
                    return registered_email_response()
                
                if id_profile_img or profile_img_path:
                    return non_modifiable_img_data_response('create')

                # Check if the request has an image
                if file and not(file_type in self.type_images):
                    return unsupported_image_response()
            
                new_account = {
                    'email': data.get('email'), 
                    'password': data.get('password'), 
                    'first_name': data.get('first_name'), 
                    'last_name': data.get('last_name'), 
                    'birthdate': data.get('birthdate'), 
                    'gender': data.get('gender'),
                    'recovery_email': data.get('recovery_email')
                }

                serializer = UserSerializerV1(data=new_account)

                if serializer.is_valid():
                    if file:
                        upload_result = cloudinary.upload(
                            file, format=self.IMG_FORMAT, folder=self.UPLOAD_FOLDER
                        )
                        new_account.update({
                            'id_profile_img': upload_result['public_id'],
                            'profile_img_path': upload_result['secure_url']
                        })

                        # Update serializer with image upload data
                        serializer = UserSerializerV1(data=new_account)
                        serializer.is_valid()

                    serializer.save()
                    return serializer_data_response(serializer)
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
                id_profile_img = data.get('id_profile_img')
                profile_img_path = data.get('profile_img_path')
                if id_profile_img or profile_img_path:
                    return non_modifiable_img_data_response('update')
                
                # Check if the request has an image 
                if file and not(file_type in self.type_images):
                    return unsupported_image_response()

                if account:
                    serializer = UserSerializerV1(account, data) 
                    
                    if serializer.is_valid():
                        # Delete registered profile photo from account
                        if account.id_profile_img:
                            cloudinary.destroy(account.id_profile_img)
                            data['id_profile_img'] = None
                            data['profile_img_path'] = None

                        if file:
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
                id_profile_img = data.get('id_profile_img')
                profile_img_path = data.get('profile_img_path')
                if id_profile_img or profile_img_path:
                    return non_modifiable_img_data_response('update')
                
                # Check if the request has an image 
                if file and (file != 'Null') and not(file_type in self.type_images):
                    return unsupported_image_response()

                if account:
                    serializer = UserSerializerV1(account, data, partial=True) 

                    if serializer.is_valid():
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
                    account.delete()
                    serializer = UserSerializerV1(account)
                    return serializer_data_response(serializer)
                return user_not_found_response()
            return invalid_version_response()
        except Exception as error:
            return generic_error_response(error)