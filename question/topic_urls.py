from django.conf.urls import url
from . import topic_views as views

urlpatterns = [
    url(r'^$',views.MyTopicView.as_view(),name='question_t_mytopic'),
    url(r'^(?P<topic_id>[0-9]+)/$',views.TopicView.as_view(),name='question_t_topic'),
    url(r'^(?P<topic_id>[0-9]+)/(?P<type>[a-z]+)/$',views.TopicView.as_view(),name='question_t_topic'),
]
