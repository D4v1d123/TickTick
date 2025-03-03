from django.urls import path

from users.views import UserAPIView, check_unique_username, check_account


urlpatterns = [
    path('users/is-available/', check_unique_username),
    path('users/<int:id_user>/', UserAPIView.as_view()),
    path('users/is-registered/', check_account),
    path('users/', UserAPIView.as_view()),
]