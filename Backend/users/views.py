from rest_framework import status, viewsets, views
from rest_framework.response import Response

from .serializer import EmailSerializer, UserSerializer
from .models import Accounts

class UserViewSet(viewsets.ModelViewSet):
    queryset = Accounts.objects.all()
    serializer_class = UserSerializer


class CheckUniqueEmailAPIView(views.APIView):
    def post(self, response):
        email = response.data.get('email')        
        serializer = EmailSerializer(data={'email': email})
        
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