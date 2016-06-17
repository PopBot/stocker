from django.conf.urls import url
from . import views
urlpatterns = [
    url(r'^get_stock', views.get_stock, name='get_stock'),
]
