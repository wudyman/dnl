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
from . import index_view 

urlpatterns = [
    url(r'^$',index_view.IndexView.as_view(),name='index'),
    url(r'^admin/', admin.site.urls),
	url(r'^login/',index_view.LoginView.as_view(),name='login'),
	#url(r'^form/',index_view.FormView.form1,name='form1'),
	url(r'^form/',index_view.FormView.as_view(),name='form'),
	url(r'^myView/',index_view.myView),
	url(r'^login2/$',index_view.FormView.as_view(),name='form1'),
	url(r'^logout/',index_view.logOut),
]
