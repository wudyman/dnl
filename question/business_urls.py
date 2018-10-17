from django.conf.urls import url
from . import business_views as views

urlpatterns = [
    url(r'^$',views.BusinessesView.as_view(),name='BusinessesView'),
    url(r'^(?P<business_id>[0-9]+)/$',views.BusinessView.as_view(),name='BusinessView'),
    url(r'^post/$',views.BusinessPostView.as_view(),name='BusinessPostView'),
]
