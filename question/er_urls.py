from django.conf.urls import url
from . import er_views as views

urlpatterns = [
    url(r'^(?P<erid>[0-9]+)/$',views.ActiveView.as_view(),name='peoplehomepage'),
    url(r'^(?P<erid>[0-9]+)/(?P<command>[a-z]+)/$',views.ActiveView.as_view(),name='peoplehomepage'),
]
