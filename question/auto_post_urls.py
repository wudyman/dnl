from django.conf.urls import url,include
from . import auto_post_views as views

urlpatterns= [
    url(r'^article/$',views.auto_post_article,name='auto_post_article'),
]
