from django.urls import include, path
from rest_framework import routers

from users.views import CheckUniqueEmailAPIView, UserViewSet 


router = routers.DefaultRouter()
router.register(r'users', UserViewSet, 'users')

urlpatterns = [
    path('users/is-available', CheckUniqueEmailAPIView.as_view()),
    path('', include(router.urls)),
]