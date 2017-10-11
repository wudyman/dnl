from django.shortcuts import render,get_object_or_404
from django.views import generic
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic
from django.contrib.auth.models import User
# Create your views here.

class IndexView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/index.html'
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
            question.topic=request.POST.get('topic')
            question.detail=request.POST.get('detail')
            question.quizzer=quizzer
            question.save()

            topic=get_object_or_404(Topic,name=question.topic)
            topic.question.add(question)
            topic.save()

            return HttpResponse("success")
            
class QuestionView(generic.ListView):
    template_name='question/t_question.html'
    context_object_name='context_question'
    #_question = get_object_or_404(Question,pk=question_id)
    def get_queryset(self):
        question_id=self.kwargs.get('question_id')
        print(question_id)
        question=get_object_or_404(Question,pk=question_id)
        return question

   # return render(request,self.template_name)

