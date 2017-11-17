from django.conf.urls import url,include
from . import ajax_views as views

urlpatterns= [
    url(r'^questions/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_questions,name='getquestions'),
    url(r'^question_follow/(?P<follow>[0-9]+)/(?P<question_id>[0-9]+)/$',views.follow_question,name='followquestion'),
    url(r'^question_answer/(?P<question_id>[0-9]+)/$',views.answer_question,name='answerquestion'),
    url(r'^answer_like/(?P<answer_id>[0-9]+)/$',views.like_answer,name='likeanswer'),
    url(r'^topics/$',views.get_topics,name='gettopics'),
    url(r'^topic_follow/(?P<follow>[0-9]+)/(?P<topic_id>[0-9]+)/$',views.follow_topic,name='followtopic'),
    url(r'^topic_adept/$',views.get_topic_adept,name='gettopicadept'),
    url(r'^upload/avatar/$',views.upload_avatar,name='uploadavatar'),
    url(r'^upload/img/$',views.upload_img,name='uploadimage'),
    url(r'^er/(?P<erid>[0-9]+)/$',views.get_erinfo,name='geterinfo'),
    url(r'^er_follow/(?P<follow>[0-9]+)/(?P<er_id>[0-9]+)/$',views.follow_er,name='follow_er'),
    url(r'^invite/$',views.invite,name='invite'),
]
