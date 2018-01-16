from django.conf.urls import url,include
from . import ajax_views as views

urlpatterns= [
    url(r'^questions/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_questions,name='getquestions'),
    url(r'^question_follow/(?P<follow>[0-9]+)/(?P<question_id>[0-9]+)/$',views.follow_question,name='followquestion'),
    url(r'^question_answer/(?P<question_id>[0-9]+)/$',views.answer_question,name='answerquestion'),
    url(r'^topics/(?P<bIsGetAll>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_topics,name='gettopics'),
    url(r'^topic/(?P<topic_id>[0-9]+)/$',views.get_topicinfo,name='gettopicinfo'),
    url(r'^topic/(?P<topic_id>[0-9]+)/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_topic_questions,name='gettopicquestions'),
    url(r'^topic_follow/(?P<follow>[0-9]+)/(?P<topic_id>[0-9]+)/$',views.follow_topic,name='followtopic'),
    url(r'^topic_adept/$',views.get_topic_adept,name='gettopicadept'),
    url(r'^answers/(?P<question_id>[0-9]+)/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_question_answers,name='getanswers'),
    url(r'^answer_like/(?P<answer_id>[0-9]+)/$',views.like_answer,name='likeanswer'),
    url(r'^er/(?P<erid>[0-9]+)/$',views.get_erinfo,name='geterinfo'),
    url(r'^er/(?P<erid>[0-9]+)/(?P<command>[a-z]+)/$',views.get_er_all,name='geterall'),
    url(r'^er/(?P<erid>[0-9]+)/following/(?P<subcmd>[a-z]+)/$',views.get_er_following_all,name='geterfollowingall'),
    url(r'^er_follow/(?P<follow>[0-9]+)/(?P<er_id>[0-9]+)/$',views.follow_er,name='follow_er'),
    url(r'^upload/avatar/$',views.upload_avatar,name='uploadavatar'),
    url(r'^upload/img/$',views.upload_img,name='uploadimage'),
    url(r'^invite/$',views.invite,name='invite'),
    url(r'^notifications/$',views.get_notifications,name='getnotifications'),
    url(r'^send_message/(?P<receiver_id>[0-9]+)/$',views.send_message,name='sendmessage'),
    url(r'^conversations/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_conversations,name='getconversations'),
    url(r'^conversation_messages/(?P<conversation_id>[0-9]+)/(?P<order>[0-9]+)/(?P<start>[0-9]+)/(?P<end>[0-9]+)/$',views.get_conversation_messages,name='getconversationmessages'),
    url(r'^delete_conversation/(?P<conversation_id>[0-9]+)/$',views.delete_conversation,name='deleteconversation'),
    url(r'^delete_conversation_message/(?P<message_id>[0-9]+)/$',views.delete_conversation_message,name='deleteconversationmessage'),
]
