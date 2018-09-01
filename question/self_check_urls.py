from django.conf.urls import url,include
from . import self_check_views as views

urlpatterns= [
    url(r'^all/$',views.check_all,name='check_all'),
]
