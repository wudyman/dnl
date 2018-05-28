from django.shortcuts import render,get_object_or_404,redirect
from django.views import generic
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.

def LogOut(request):
	logout(request)
	return HttpResponseRedirect('/signinup/')
    
class SigninupView(generic.ListView):
    template_name='question/t_sign.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_sign_mobile.html'
        return render(request,self.template_name)
    def post(self,request,*args,**kwargs):
        if request.POST.get('regPhoneNo'):
            key=request.POST.get('regPhoneNo')
            if User.objects.filter(username=key):
                print(key+':have register!')
                return HttpResponseRedirect('/account/?arg=e_registered')
            cach_veri_code=request.session.get(key,None)
            if cach_veri_code:
                veri_code=request.POST.get('digits')
                #print(type(veri_code))
                #print(type(cach_veri_code))
                if veri_code==cach_veri_code:
                    name=key
                    pwd=request.POST.get('regPassword')
                    print(pwd)
                    user=User.objects.create_user(username=name,password=pwd)
                    user.first_name=request.POST.get('nickname')
                    user.save()
                    userprofile=UserProfile()
                    userprofile.user=user
                    userprofile.phone=name
                    userprofile.save()
                    
                    login(request,user)
                    return HttpResponseRedirect('/')
            return HttpResponseRedirect('/account/?arg=e_veri_code')
        elif request.POST.get('loginPhoneNo'):
            name=request.POST.get('loginPhoneNo')
            pwd=request.POST.get('loginPassword')
            user=authenticate(username=name,password=pwd)
            if user is not None:
                login(request,user)
                next_to=request.GET.get('next',None)
                if next_to:
                    return redirect(next_to)
                else:
                    return HttpResponseRedirect('/')
            return HttpResponseRedirect('/account/?arg=e_u_p')
        else:
            return HttpResponseRedirect('/account/?arg=e_l_r')
            
class AccountView(generic.ListView):
    template_name='question/t_misc.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_misc_mobile.html'
        arg=request.GET.get('arg')
        if arg:
            return render(request,self.template_name,{'arg':arg})
        return HttpResponseRedirect('/')
class AllTopicsView(generic.ListView):
    #login_url='/'
    template_name='question/t_alltopics.html'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        topics_list=Topic.objects.order_by('-pub_date')
        user=request.user #get_object_or_404(User,username=request.user)
        if user.is_authenticated:
            followtopics_list=user.followtopics.all()
            return render(request,self.template_name,{'topics_list':topics_list,'followtopics_list':followtopics_list,'logged':'true'})
        else:
            return render(request,self.template_name,{'topics_list':topics_list,'logged':'true'})

class NotificationView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_setting.html'
    type='notifications'
    #context_object_name='latest_topics_list'
    def get_queryset(self):
        return
        # Topic.objects.order_by('-pub_date')
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_setting_mobile.html'
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'type':self.type,'logged':'true'})
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
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_setting_mobile.html'
        user=request.user
        if user.is_authenticated:
            conversation_id=request.GET.get('i')
            if conversation_id:
                conversation=get_object_or_404(Conversation,pk=conversation_id)
                if conversation:
                    self.type='conversation_messages'
                    parter=conversation.initator
                    if parter.id==user.id:
                        parter=conversation.parter
                    return render(request,self.template_name,{'type':self.type,'conversation_id':conversation_id,'parter':parter,'parter_name':parter.first_name,'logged':'true'})
                else:
                    return render(request,self.template_name,{'type':self.type,'conversation_id':'','logged':'true'})               
            else:
                return render(request,self.template_name,{'type':self.type,'conversation_id':'','logged':'true'})
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
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_setting_mobile.html'
        user=request.user
        if user.is_authenticated:
            self.sub_type=request.GET.get('sub')
            if not self.sub_type:
                self.sub_type='profile'
            return render(request,self.template_name,{'type':self.type,'sub_type':self.sub_type,'logged':'true'})
        else:
            return HttpResponseRedirect('/signinup/')
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
        if user.is_authenticated:
            logged='true'
            self.type=request.GET.get('type')
            if not self.type:
                self.type='recommend'
            return render(request,self.template_name,{'type':self.type,'logged':logged})
        else:
            return HttpResponseRedirect('/signinup/')
        
class SearchView(generic.ListView):
    #login_url='/'
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
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_search_mobile.html'
        self.keyword=request.GET.get('q')
        if not self.keyword:
            self.keyword=''
        self.type=request.GET.get('type')
        if not self.type:
            self.type=''
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'keyword':self.keyword,'type':self.type,'logged':'true'})
        else:
            return render(request,self.template_name,{'keyword':self.keyword,'type':self.type,'logged':'false'})
        
class WriteView(generic.ListView):
    login_url='/'
    template_name='question/t_write.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_write_mobile.html'
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'logged':'true'})
        else:
            return HttpResponseRedirect('/signinup/')
    def post(self,request):
        user=request.user
        if not user.is_authenticated:
            return HttpResponseRedirect('/signinup/')
        else:
            topics=request.POST.getlist('topics_selected')#('topics')#
            prima_topic_array=topics[0].split(':')

            article=Article()
            article.title=request.POST.get('writeTitle')
            article.content=request.POST.get('writeContent')
            article.author=user
            article.prima_topic_id=int(prima_topic_array[0])
            article.prima_topic_name=prima_topic_array[1]            
            article.save()
            
            for topic_str in topics:
                topic_array=topic_str.split(':')
                topic=get_object_or_404(Topic,id=topic_array[0])
                topic.article.add(article)
                topic.article_nums=topic.article.count()
                topic.save()
            result='/article/'+str(article.id)+'/'
            return HttpResponseRedirect(result)

class ArticleView(generic.ListView):
    login_url='/'
    template_name='question/t_article.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_article_mobile.html'
        article_id=self.kwargs.get('article_id')
        article=get_object_or_404(Article,pk=article_id)
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'article':article,'logged':'true'})
        else:
            return render(request,self.template_name,{'article':article,'logged':'false'})
            
class TradeView(LoginRequiredMixin,generic.ListView):
    login_url='/'
    template_name='question/t_no_feature.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_no_feature.html'
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'logged':'true'})
        else:
            return HttpResponseRedirect('/signinup/')
