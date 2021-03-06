from django.shortcuts import render,get_object_or_404,redirect
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

class IndexView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_index.html'
    context_object_name='latest_question_list'
    def get_queryset(self):
        return Question.objects.order_by('-pub_date')[:5]
    def post(self,request):
        print(request.POST.items)
        #print(request.user.__dict__)
        print(request.user)
        if not request.user.is_authenticated:
            return HttpResponse("fail")
        else:
            quizzer=get_object_or_404(User,username=request.user)

            question=Question()
            question.title=request.POST.get('title')
            #question.topic=request.POST.get('topics')
            question.detail=request.POST.get('detail')
            question.quizzer=quizzer
            question.save()
            
            
            topics=request.POST.getlist('topics_selected')#('topics')
            for topic in topics:
                print(topic)
                topic=get_object_or_404(Topic,name=topic)
                topic.question.add(question)
                topic.save()
            result='/question/'+str(question.id)+'/'
            return HttpResponseRedirect(result)
            
class SigninupView(generic.ListView):
    template_name='question/t_signinup.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        print(request.GET.items)
        return render(request,self.template_name)
    def post(self,request,*args,**kwargs):
        print(request.POST.items)
        if request.POST.get('nickname'):
            name=request.POST.get('email_phone')
            pwd=request.POST.get('password')
            email=name
            user=User.objects.create_user(name,email,pwd)
            user.first_name=request.POST.get('nickname')
            user.save()

            userprofile=UserProfile()
            userprofile.intro='i m the king'
            userprofile.user=user
            userprofile.save()
            return HttpResponse('signup success')
        else:
            name=request.POST.get('email_phone')
            pwd=request.POST.get('password')
            user=authenticate(username=name,password=pwd)
            if user is not None:
                login(request,user)
                next_to=request.GET.get('next',None)
                if next_to:
                    return redirect(next_to)
                else:
                    return HttpResponse('signin success')
            else:
                return HttpResponse('signin fail')

class QuestionView(generic.ListView):
    template_name='question/t_question.html'
    context_object_name='context_question'
    #_question = get_object_or_404(Question,pk=question_id)
    def get_queryset(self):
        question_id=self.kwargs.get('question_id')
        question=get_object_or_404(Question,pk=question_id)
        return question
    
    def post(self,request,*args,**kwargs):
        print(request.POST.items)
        author=get_object_or_404(User,username=request.user)
        question_id=self.kwargs.get('question_id')
        question=get_object_or_404(Question,pk=question_id)
        answer=Answer()
        answer.content=request.POST.get('content')
        answer.author=author
        answer.question=question
        answer.save()
        return render(request,self.template_name,{'context_question':question})
   # return render(request,self.template_name)
