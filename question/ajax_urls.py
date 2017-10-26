from django.conf.urls import url,include
from . import ajax_views as views

urlpatterns= [
    url(r'^questions/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_questions,name='getquestions'),
    url(r'^topics/$',views.get_topics,name='gettopics'),
    url(r'^topic_follow/(?P<follow>[0-9]+)/(?P<topic_id>[0-9]+)/$',views.follow_topic,name='followtopic'),
    url(r'^upload/img/$',views.upload_img,name='uploadimage'),
    url(r'^er/(?P<erid>[0-9]+)/$',views.get_erinfo,name='geterinfo'),
    url(r'^er_follow/(?P<follow>[0-9]+)/(?P<er_id>[0-9]+)/$',views.follow_er,name='follow_er'),
]
