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
    def get_queryset(self):
        return
    def post(self,request):
        print(request.POST.items)
        #print(request.user.__dict__)
        print(request.user)
        if not request.user.is_authenticated:
            return HttpResponse("fail")
        else:
            _quizzer=get_object_or_404(User,username=request.user)

            _question=Question()
            _question.title=request.POST.get('title')
            _question.topic=request.POST.get('topic')
            _question.detail=request.POST.get('detail')
            _question.quizzer=_quizzer
            _question.save()

            _topic=get_object_or_404(Topic,name=_question.topic)
            _topic.question.add(_question)
            _topic.save()

            return HttpResponse("success")

   
   # return render(request,self.template_name)

