from django.conf.urls import url
from . import er_views as views

urlpatterns = [
    url(r'^(?P<userid>[0-9]+)/$',views.ActiveView.as_view(),name='peoplehomepage'),
]
