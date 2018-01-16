from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class MyTopicView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_mytopic.html'
    context_object_name='mytopic_list'
    def get_queryset(self):
        pass
    def get(self,request,*args,**kwargs):
        user=request.user #get_object_or_404(User,username=request.user)
        mytopic_list=user.followtopics.all()
        if mytopic_list:
            return render(request,self.template_name,{'mytopic_list':mytopic_list}) 
        else:
            return HttpResponseRedirect('/topics/')           

class TopicView(generic.ListView):
    template_name='question/t_topic.html'
    context_object_name='context_topic'
    #_question = get_object_or_404(Question,pk=question_id)
    def get_queryset(self):
        topic_id=self.kwargs.get('topic_id')
        topic=get_object_or_404(Topic,pk=topic_id)
        return topic
    
    def post(self,request,*args,**kwargs):
        author=request.user #get_object_or_404(User,username=request.user)
        question_id=self.kwargs.get('question_id')
        question=get_object_or_404(Question,pk=question_id)
        answer=Answer()
        answer.content=request.POST.get('content')
        answer.author=author
        answer.question=question
        answer.save()
        return render(request,self.template_name,{'context_question':question})
