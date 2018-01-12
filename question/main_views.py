from django.shortcuts import render,get_object_or_404,redirect
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Question,Topic,Answer,Comment,UserProfile,Conversation
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

def LogOut(request):
	logout(request)
	return HttpResponseRedirect('/signinup/')
    
class SigninupView(generic.ListView):
    template_name='question/signinup.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        return render(request,self.template_name)
    def post(self,request,*args,**kwargs):
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
            
            login(request,user)
            return HttpResponseRedirect('/')
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
                    return HttpResponseRedirect('/')
            else:
                return HttpResponse('signin fail')

class AllTopicsView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_alltopics.html'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        topics_list=Topic.objects.order_by('-pub_date')
        user=request.user #get_object_or_404(User,username=request.user)
        followtopics_list=user.followtopics.all()
        return render(request,self.template_name,{'topics_list':topics_list,'followtopics_list':followtopics_list})
        
class ConversationView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_setting.html'
    type='conversations'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        conversation_id=request.GET.get('i')
        if conversation_id:
            conversation=get_object_or_404(Conversation,pk=conversation_id)
            if conversation:
                user=request.user
                parter=conversation.initator
                if parter.id==user.id:
                    parter=conversation.parter
                return render(request,self.template_name,{'type':self.type,'conversation_id':conversation_id,'parter':parter})
            else:
                return render(request,self.template_name,{'type':self.type,'conversation_id':'null'})               
        else:
            return render(request,self.template_name,{'type':self.type,'conversation_id':'null'})
        #user=request.user #get_object_or_404(User,username=request.user)
        #conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        #conversation_list=conversations.order_by('-update_date')[:10]
        #return render(request,self.template_name,{'conversation_list':conversation_list})
