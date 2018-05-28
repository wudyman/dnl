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
        er=get_object_or_404(User,pk=erid)
        
        user=request.user
        if user.is_authenticated:
            logged='true'
            if user.followto.filter(id=er.id).exists():
                followed='true'
            else:
                followed='false'
        else:
            logged='false'
            followed='false'
            
        questions_num=er.selfquestions.count()
        answers_num=er.answers.count()
        followtos_num=er.followto.count()
        followers_num=er.userprofile.follower.count()
        followtopics_num=er.followtopics.count()
        followquestions_num=er.followquestions.count()
        
        ext_info={'questions_num':questions_num,'answers_num':answers_num,'followtos_num':followtos_num,'followers_num':followers_num,'followtopics_num':followtopics_num,'followquestions_num':followquestions_num}       
        return render(request,self.template_name,{'logged':logged,'er':er,'user':user,'followed':followed,'command':command,'subcmd':subcmd,'ext_info':ext_info})