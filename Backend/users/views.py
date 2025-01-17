from rest_framework import status, viewsets, views
from rest_framework.response import Response

from .serializer import EmailSerializerV1, UserSerializerV1
from .models import Accounts

class UserViewSet(viewsets.ModelViewSet):
    queryset = Accounts.objects.all()
    
    def get_serializer_class(self):
        version = self.request.version
        
        # API version 1
        if(version == "v1"):
            return UserSerializerV1


class CheckUniqueEmailAPIView(views.APIView):
    def post(self, request, version):
        # API version 1
        if(version == "v1"):
            email = request.data.get('email')        
            serializer = EmailSerializerV1(data={'email': email})
            
            if(not(serializer.is_valid())):
                return Response(
                    {"detail": "The 'email' parameter must have username@domain.extension"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            email_exists = Accounts.objects.values('email').filter(email=email).exists()
            return Response(
                {"isAvailable": not(email_exists)}, 
                status=status.HTTP_200_OK
            )