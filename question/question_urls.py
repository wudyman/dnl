from django.conf.urls import url
from . import question_views as views

urlpatterns = [
    #url(r'^$',views.FakeIndexView.as_view(),name='question_fake_index'),
    #url(r'^app/$',views.IndexView.as_view(),name='question_index'),
    url(r'^$',views.IndexView.as_view(),name='question_index'),
    url(r'^(?P<question_id>[0-9]+)/$',views.QuestionView.as_view(),name='question_t_question'),
]
