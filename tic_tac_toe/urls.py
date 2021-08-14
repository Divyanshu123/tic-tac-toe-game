from django.urls import path
from . import views  


app_name = "tic_tac_toe"

urlpatterns = [
    path("",views.index, name = "index"),
]