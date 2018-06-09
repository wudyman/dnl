from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
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
            return HttpResponseRedirect('/signinup/')
        else:
            quizzer=request.user #get_object_or_404(User,username=request.user)
            topics=request.POST.getlist('topics_selected')#('topics')

            question=Question()
            question.title=request.POST.get('title')
            #question.topic=request.POST.get('topics')
            question.detail=request.POST.get('detail')
            question.quizzer=quizzer         
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
        push_answer_id=request.GET.get('ans')
        #question_data=Question.filter(id=question_id).values_list("id","title")
        question=get_object_or_404(Question,pk=question_id)
        #question.click_nums+=1
        #question.save()
        user=request.user
        if user.is_authenticated:
            logged='true'
        else:
            logged='false'
        push_answer_id=request.GET.get('ans')
        if push_answer_id:
            push_index=question.push_index
            more_answers_sets=question.be_answers.filter(push_index__gte=0).values("id","push_index","content","like_nums","comment_nums","pub_date"
            ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
            ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")[0:3]
            
            push_answer_sets=question.be_answers.filter(id=push_answer_id).values("id","push_index","content","like_nums","comment_nums","pub_date"
            ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
            ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
            more_answers=''
            push_answer=push_answer_sets[0]
            return render(request,self.template_name,{'user':user,'context_question':question,'push_answer':push_answer,'more_answers':more_answers_sets,'logged':logged})
        else:
            return render(request,self.template_name,{'user':user,'context_question':question,'logged':logged})
                
