from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class ActiveView(generic.ListView):
    template_name='question/t_er_active.html'
    def get_queryset(self): 
        pass
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_er_active_mobile.html'
        command=self.kwargs.get('command')
        subcmd=self.kwargs.get('subcmd')
        if not command:
            command='answers'
        if not subcmd:
            subcmd='followtos'
        erid=self.kwargs.get('erid')
        
        user=request.user
        if user.is_authenticated:
            logged='true'
        else:
            logged='false'
        
        er_data=User.objects.filter(id=erid).values("id","first_name","userprofile__avatar","userprofile__avatar","userprofile__avatar","userprofile__avatar","userprofile__avatar"
        ,"userprofile__mood","userprofile__intro","userprofile__sexual","userprofile__residence","userprofile__job","userprofile__question_nums","userprofile__article_nums","userprofile__answer_nums","userprofile__business_nums"
        ,"userprofile__followto_nums","userprofile__follower_nums","userprofile__followtopic_nums","userprofile__followquestion_nums","userprofile__contribution")

        return render(request,self.template_name,{'logged':logged,'user':user,'command':command,'subcmd':subcmd,'er':er_data[0]})