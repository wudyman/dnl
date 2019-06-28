from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from . import configure
# Create your views here.

class FakeIndexView(generic.ListView):
    #login_url='/signinup/?next=/'
    template_name='question/t_fake_index.html'
    #context_object_name='latest_question_list'
    def get_queryset(self):
        pass

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
            question.topics_array=topics 
            question.save()
            
            quizzer.userprofile.question_nums+=1
            quizzer.userprofile.contribution+=configure.ASK_CONTRIBUTION
            quizzer.userprofile.save()
            
            for topic_str in topics:
                topic_array=topic_str.split(':')
                topic=get_object_or_404(Topic,id=topic_array[0])
                topic.question.add(question)
                topic.question_nums+=1 ##topic.question.count()
                topic.save()
            result='/question/'+str(question.id)+'/'
            return HttpResponseRedirect(result)

class QuestionView(generic.ListView):
    template_name='question/t_question.html'
    def get1_queryset(self):
        pass
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_question_mobile.html'
        question_id=self.kwargs.get('question_id')
        push_answer_id=request.GET.get('ans')
        #question.click_nums+=1
        #question.save()
        user=request.user
        if user.is_authenticated:
            logged='true'
        else:
            logged='false'
        if push_answer_id:
            question=get_object_or_404(Question,pk=question_id)
            push_index=question.push_index
            more_answers_sets=question.be_answers.exclude(id=push_answer_id).filter(push_index__gte=0).values("id","push_index","content","like_nums","comment_nums","pub_date"
            ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
            ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")[0:2]
            
            push_answer_sets=question.be_answers.filter(id=push_answer_id).values("id","push_index","content","like_nums","comment_nums","pub_date"
            ,"author__id","author__first_name","author__userprofile__avatar","author__userprofile__mood","author__userprofile__sexual","author__userprofile__question_nums","author__userprofile__article_nums"
            ,"author__userprofile__answer_nums","author__userprofile__followto_nums","author__userprofile__follower_nums","author__userprofile__followtopic_nums","author__userprofile__followquestion_nums")
            push_answer=push_answer_sets[0]
            
            question_data=[question.id,question.title,question.detail,question.answer_nums,question.follower_nums,question.click_nums]
            topics_list=question.topics.values_list("id","name","avatar","detail","question_nums","article_nums","follower_nums")
            return render(request,self.template_name,{'user':user,'question':question_data,'topics_list':topics_list,'push_answer':push_answer,'more_answers':more_answers_sets,'logged':logged,'SITE':configure.SITE})
        else:
            question_data=Question.objects.filter(id=question_id).values_list("id","title","detail","answer_nums","follower_nums","click_nums",
            "topics__id","topics__name","topics__avatar","topics__detail","topics__question_nums","topics__article_nums","topics__follower_nums")
            #question=question_data[0][0:6]
            topics_list=[]
            for item in question_data:
                question=item[0:6]
                topic=item[6:13]
                topics_list.append(topic)
                
            all_answers_sets_10=Question.objects.filter(id=question_id).values("be_answers__id","be_answers__content","be_answers__like_nums","be_answers__comment_nums","be_answers__pub_date",
            "be_answers__author__id","be_answers__author__first_name","be_answers__author__userprofile__avatar","be_answers__author__userprofile__mood",
            "be_answers__author__userprofile__sexual","be_answers__author__userprofile__question_nums","be_answers__author__userprofile__article_nums","be_answers__author__userprofile__answer_nums",
            "be_answers__author__userprofile__followto_nums","be_answers__author__userprofile__follower_nums","be_answers__author__userprofile__followtopic_nums","be_answers__author__userprofile__followquestion_nums")[0:10]
            
            if None==all_answers_sets_10[0]['be_answers__id']:
                all_answers_sets_10=None

            return render(request,self.template_name,{'user':user,'question':question,'topics_list':topics_list,'all_answers_sets_10':all_answers_sets_10,'logged':logged,'SITE':configure.SITE})
                
