from django.conf.urls import url,include
from . import ajax_views as views

urlpatterns= [
    url(r'^topics/$',views.get_topics,name='gettopics'),
]
