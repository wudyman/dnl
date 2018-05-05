from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class IndexView(generic.ListView):
    #login_url='/signinup/?next=/'
    template_name='question/t_index.html'
    #context_object_name='latest_question_list'
    def get_queryset(self):
        pass
    def get(self,request):
        user=request.user
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_index_mobile.html'
            if user.is_authenticated:
                return render(request,self.template_name,{'logged':'true'})
            else:
                return render(request,self.template_name)
        else:
            if user.is_authenticated:
                return render(request,self.template_name,{'logged':'true'})
            else:
                return render(request,self.template_name)
    def post(self,request):
        #print(request.POST.items)
        #print(request.user.__dict__)
        if not request.user.is_authenticated:
            return HttpResponse("fail")
        else:
            quizzer=request.user #get_object_or_404(User,username=request.user)
            topics=request.POST.getlist('topics_selected')#('topics')#
            prima_topic_array=topics[0].split(':')

            question=Question()
            question.title=request.POST.get('title')
            #question.topic=request.POST.get('topics')
            question.detail=request.POST.get('detail')
            question.quizzer=quizzer
            question.prima_topic_id=int(prima_topic_array[0])
            question.prima_topic_name=prima_topic_array[1]            
            question.save()
            
            for topic_str in topics:
                topic_array=topic_str.split(':')
                topic=get_object_or_404(Topic,id=topic_array[0])
                topic.question.add(question)
                topic.question_nums=topic.question.count()
                topic.save()
            result='/question/'+str(question.id)+'/'
            return HttpResponseRedirect(result)

class QuestionView(generic.ListView):
    template_name='question/t_question.html'
    #context_object_name='context_question'
    #_question = get_object_or_404(Question,pk=question_id)
    def get_queryset(self):
        pass
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_question_mobile.html'
        question_id=self.kwargs.get('question_id')
        question=get_object_or_404(Question,pk=question_id)
        user=request.user
        if user.is_authenticated:
            logged='true'
            if question.follower.filter(pk=user.pk).exists():
                followed='true'
            else:
                followed='false'
        else:
            logged='false'
            followed='false'
        push_answer_id=request.GET.get('ans')
        if push_answer_id:
            push_answer=get_object_or_404(Answer,pk=push_answer_id)
            return render(request,self.template_name,{'user':user,'context_question':question,'followed':followed,'push_answer':push_answer,'logged':logged})
        else:
            return render(request,self.template_name,{'user':user,'context_question':question,'followed':followed,'logged':logged})
