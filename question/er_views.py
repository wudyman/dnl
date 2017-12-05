from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class ActiveView(generic.ListView):
    template_name='question/t_er_active.html'
    def get_queryset(self): 
        pass
    def get(self,request,*args,**kwargs):
        command=self.kwargs.get('command')
        if not command:
            command='answers'
        user=request.user
        erid=self.kwargs.get('erid')
        er=get_object_or_404(User,pk=erid)
        return render(request,self.template_name,{'er':er,'user':user,'command':command})