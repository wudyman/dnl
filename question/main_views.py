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
    template_name='question/t_signinup.html'
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

class NotificationView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_setting.html'
    type='notifications'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        user=request.user
        if user:
            return render(request,self.template_name,{'type':self.type})
        else:
            return HttpResponseRedirect('/')
        
class ConversationView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_setting.html'
    type='conversations'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        user=request.user
        if user:
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
        else:
            return HttpResponseRedirect('/')
        #user=request.user #get_object_or_404(User,username=request.user)
        #conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        #conversation_list=conversations.order_by('-update_date')[:10]
        #return render(request,self.template_name,{'conversation_list':conversation_list})
        
class SettingsView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_setting.html'
    type='settings'
    sub_type='profile'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        user=request.user
        if user:
            self.sub_type=request.GET.get('sub')
            if not self.sub_type:
                self.sub_type='profile'
            return render(request,self.template_name,{'type':self.type,'sub_type':self.sub_type})
        else:
            return HttpResponseRedirect('/')
        #user=request.user #get_object_or_404(User,username=request.user)
        #conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        #conversation_list=conversations.order_by('-update_date')[:10]
        #return render(request,self.template_name,{'conversation_list':conversation_list})
        
class AnswerView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_answer.html'
    type='recommend'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        user=request.user
        if user:
            self.type=request.GET.get('type')
            if not self.type:
                self.type='recommend'
            return render(request,self.template_name,{'type':self.type})
        else:
            return HttpResponseRedirect('/')
        
class SearchView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_search.html'
    keyword=''
    type='content'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print(is_mobile)
        if is_mobile:
            self.template_name='question/t_search_mobile.html'
        user=request.user
        if user:
            self.keyword=request.GET.get('q')
            print(self.keyword)
            self.type=request.GET.get('type')
            return render(request,self.template_name,{'keyword':self.keyword,'type':self.type})
        else:
            return HttpResponseRedirect('/')
        #user=request.user #get_object_or_404(User,username=request.user)
        #conversations=Conversation.objects.filter(initator__id=user.id) | Conversation.objects.filter(parter__id=user.id)
        #conversation_list=conversations.order_by('-update_date')[:10]
        #return render(request,self.template_name,{'conversation_list':conversation_list})
        
class WriteView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_no_feature.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        return render(request,self.template_name)
        
class TradeView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_no_feature.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        return render(request,self.template_name)
