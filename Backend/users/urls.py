from django.urls import path

from users.views import CheckUniqueUsernameAPIView, UserAPIView, checkAccount


urlpatterns = [
    path('users/is-available/', CheckUniqueUsernameAPIView.as_view()),
    path('users/<int:id_user>/', UserAPIView.as_view()),
    path('users/is-registered/', checkAccount),
    path('users/', UserAPIView.as_view()),
]