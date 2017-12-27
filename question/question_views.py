from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class IndexView(LoginRequiredMixin,generic.ListView):
    login_url='/signinup/'
    template_name='question/index.html'
    #context_object_name='latest_question_list'
    def get_queryset(self):
        pass
    def get(self,request):
        return render(request,self.template_name,{'user':request.user})
        '''
        questions=Question.objects.order_by('-pub_date')[0:10]
        question_list=[]
    
        for question in questions:
            temp=[]
            temp.append(question.id) #0
            temp.append(question.title) #1
            temp.append(question.prima_topic_id) #2
            temp.append(question.prima_topic_name) #3
            if question.push_answer_id!=0:
                temp.append(question.push_answer_id) #4
                answer=get_object_or_404(Answer,pk=question.push_answer_id)
                if answer:
                    temp.append(answer.author.id) #5
                    temp.append(answer.author.first_name) #6
                    temp.append(answer.author.userprofile.avatar) #7
                    temp.append(answer.author.userprofile.mood) #8
                    temp.append(answer.content) #9
                    temp.append(answer.like_nums) #10
                    temp.append(answer.comment_nums) #11
                    temp.append(str(answer.pub_date)) #12
                    question_list.append(temp)
        return render(request,self.template_name,{'question_list':question_list,'user':request.user})
        '''
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
        question_id=self.kwargs.get('question_id')
        question=get_object_or_404(Question,pk=question_id)
        user=request.user
        if question.follower.filter(pk=user.pk).exists():
            followed='true'
        else:
            followed='false'
        push_answer_id=request.GET.get('ans')
        if push_answer_id:
            print('not none')
            push_answer=get_object_or_404(Answer,pk=push_answer_id)
            return render(request,self.template_name,{'user':user,'context_question':question,'followed':followed,'push_answer':push_answer})
        else:
            print('none')
            return render(request,self.template_name,{'user':user,'context_question':question,'followed':followed})
    '''
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
    '''
