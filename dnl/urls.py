"""dnl URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from django.contrib import auth
from django.contrib.auth import views
#from . import index_view 
import question.main_views as main_views

urlpatterns = [
    #url(r'^$',main_views.IndexView.as_view(),name='homepage'),
    url(r'^',include('question.question_urls')),
    url(r'^admin/', admin.site.urls),
	url(r'^signinup/$',main_views.SigninupView.as_view(),name='signinup'),
    url(r'^account/$',main_views.AccountView.as_view(),name='account'),
    url(r'^topics/$',main_views.AllTopicsView.as_view(),name='alltopics'),
    url(r'^exit/',main_views.LogOut),
    url(r'^notifications/$',main_views.NotificationView.as_view()),
    url(r'^conversations/$',main_views.ConversationView.as_view()),
    url(r'^settings/$',main_views.SettingsView.as_view()),
    url(r'^answer_page/$',main_views.AnswerView.as_view()),
    url(r'^search/$',main_views.SearchView.as_view()),
    url(r'^write/$',main_views.WriteView.as_view()),
    url(r'^trade/$',main_views.TradeView.as_view()),
	#url(r'^form/',index_view.FormView.form1,name='form1'),
	#url(r'^form/',index_view.FormView.as_view(),name='form'),
	#url(r'^myView/',index_view.myView),
	#url(r'^login2/$',index_view.FormView.as_view(),name='form1'),
    url(r'^question/',include('question.question_urls')),
    url(r'^topic/',include('question.topic_urls')),
    url(r'^ajax/',include('question.ajax_urls')),
    url(r'^er/',include('question.er_urls')),
]
