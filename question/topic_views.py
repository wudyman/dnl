from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class MyTopicView(generic.ListView):
    #login_url='/'
    template_name='question/t_mytopic.html'
    context_object_name='mytopic_list'
    def get_queryset(self):
        pass
    def get(self,request,*args,**kwargs):
        user=request.user #get_object_or_404(User,username=request.user)
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_mytopic_mobile.html'
        if user.is_authenticated:
            mytopic_list=user.followtopics.all()
            if mytopic_list:
                return render(request,self.template_name,{'mytopic_list':mytopic_list,'logged':'true'})
            else:
                if is_mobile:
                    return render(request,self.template_name,{'logged':'true'})
                else:
                    return HttpResponseRedirect('/topics/')
        else:
            if is_mobile:
                return render(request,self.template_name,{'logged':'false'})
            else:
                return HttpResponseRedirect('/topics/')

class TopicView(generic.ListView):
    template_name='question/t_topic.html'
    def get_queryset(self):
        pass
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_topic_mobile.html'
        topic_id=self.kwargs.get('topic_id')
        topic=get_object_or_404(Topic,pk=topic_id)
        if topic:
            type=self.kwargs.get('type')
            user=request.user
            if user.is_authenticated:
                logged='true'
                if topic.follower.filter(pk=user.pk).exists():
                    followed='true'
                else:
                    followed='false'
            else:
                logged='false'
                followed='false'
            return render(request,self.template_name,{'context_topic':topic,'type':type,'followed':followed,'logged':logged})
        return HttpResponse('no this page')
