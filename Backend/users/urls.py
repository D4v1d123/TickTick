from django.urls import path

from users.views import UserAPIView, check_unique_username, login

urlpatterns = [
    path("users/<int:id_user>/", UserAPIView.as_view()),
    path("users/is-available/", check_unique_username),
    path("users/", UserAPIView.as_view()),
    path("users/login/", login),
]
