from django.contrib.auth.decorators import login_required
from django.views import generic
from django.shortcuts import render
from django.http import HttpResponse
from pprint import pprint
from django.shortcuts import redirect
#from .form import NameForm
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User

def login1(request):
	print(request.method)
	print(request.__dict__)
	return render(request,'login/login.html')


class IndexView(generic.ListView):
    template_name='home/index.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        print(request.GET.items)
        return render(request,self.template_name)
    def post(self,request,*args,**kwargs):
        print(request.POST.items)
        if request.POST.get('signin_name'):
            name=request.POST.get('signin_name')
            pwd=request.POST.get('password')
            user=authenticate(username=name,password=pwd)
            if user is not None:
                login(request,user)
                next_to=request.GET.get('next',None)
                if next_to:
                    return redirect(next_to)
                else:
                    return HttpResponse('login success')
            else:
                return HttpResponse('login fail')
        else:
            name=request.POST.get('signup_name')
            pwd=request.POST.get('password')
            email=request.POST.get('email')
            user=User.objects.create_user(name,email,pwd)
            user.save()
            return HttpResponse('signup success')




class LoginView(generic.ListView):
	print('LoginView enter 3')
	template_name='login/login.html'
	def get_queryset(self):
		return
	def get(self,request,*args,**kwargs):
		print(request.GET.items)
		return render(request,self.template_name)
	def post(self,request,*args,**kwargs):
		print(request.method)
		print(dir(request))
		print(request.__dict__)
		print(request.POST.__dict__)
		print(request._post.__dict__)
		print(request.POST.get('user'))
		print(request.POST.items)
		#print('\n'.join(['%s:%s' % item for item in request.__dict__.items()]))
		return HttpResponse('post')

class FormView(generic.ListView):
	template_name='login/form.html'
	def get(self,request,*args,**kwargs):
		form=NameForm()
		return render(request,self.template_name,{'formtag':form})
	def post(self,request,*args,**kwargs):
		form=NameForm(request.POST)
		if form.is_valid():
			name=form.cleaned_data['your_name']
			pwd=form.cleaned_data['password']
			user=authenticate(username=name,password=pwd)
			if user is not None:
				login(request,user)
				return HttpResponse('success')
			else:
				return HttpResponse('fail')
	def form1(self):
		print(' function form1')
		return HttpResponse('form1')

@login_required
def myView(request):
	return HttpResponse('success myView')

def logOut(request):
	logout(request)
	return HttpResponse('logout')
