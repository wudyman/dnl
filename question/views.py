from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse
# Create your views here.

class IndexView(generic.ListView):
    template_name='question/index.html'
    return render(request,self.template_name)

