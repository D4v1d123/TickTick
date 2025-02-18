from rest_framework import status
from rest_framework.response import Response


# Error responses
def invalid_version_response():
    return Response(
        {'error': 'Invalid version'}, 
        status=status.HTTP_400_BAD_REQUEST
    )

def generic_error_response(error):
    return Response(
        {'error': str(error)},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

def unsupported_image_response():
    return Response(
        {'error': 'Unsupported image format, use \'jpeg\', \'png\', \'webp\', \'svg\', \'heic\' or \'heif\''},
        status=status.HTTP_400_BAD_REQUEST
    )

def user_not_found_response():
    return Response(
        {"error": "User not found"}, 
        status=status.HTTP_404_NOT_FOUND
    )

def serializer_error_response(serializer):
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )

def incorrect_email_response():
    return Response(
        {'detail': 'The \'email\' parameter must have username@domain.extension'},
        status=status.HTTP_400_BAD_REQUEST
    )
    
def registered_email_response():
    return Response(
        {'error': 'Email is already registered'}, 
        status=status.HTTP_409_CONFLICT
    )
    
def required_field_response(field):
    return Response(
        {field: ["This field is required."]}, 
        status=status.HTTP_400_BAD_REQUEST
    )


# Correct responses
def serializer_data_response(serializer):
    return Response(
        serializer.data, 
        status=status.HTTP_200_OK
    )

def email_available_response(availability_status):
    return Response(
        {'isAvailable': availability_status}, 
        status=status.HTTP_200_OK
    )