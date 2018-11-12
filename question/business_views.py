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

class BusinessesView(generic.ListView):
    login_url='/'
    template_name='question/t_businesses.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_businesses_mobile.html'
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'logged':'true'})
        else:
            return render(request,self.template_name,{'logged':'false'})
            
class BusinessView(generic.ListView):
    login_url='/'
    template_name='question/t_business.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_business_mobile.html'
        business_id=self.kwargs.get('business_id')
            #businessInfo=get_object_or_404(BusinessInfo,pk=business_id)
        businessInfos=BusinessInfo.objects.filter(pk=business_id).values("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name","poster__userprofile__avatar","poster__userprofile__mood",'poster__userprofile__sexual')
        if businessInfos:   
            businessInfo=businessInfos[0]
            user=request.user
            if user.is_authenticated:
                logged='true'
            else:
                logged='false'
            return render(request,self.template_name,{'logged':logged,'businessInfo':businessInfo})
            
class BusinessPostView(generic.ListView):
    login_url='/'
    template_name='question/t_business_post.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_business_post_mobile.html'
        user=request.user
        if user.is_authenticated:
            return render(request,self.template_name,{'logged':'true'})
        else:
            return HttpResponseRedirect('/signinup/?next=/business/post/')
    def post(self,request):
        user=request.user
        if not user.is_authenticated:
            return HttpResponseRedirect('/signinup/?next=/business/post/')
        else:
            #print(request.POST)
            businessInfo=BusinessInfo()
            businessInfo.poster=user
            businessInfo.title=request.POST.get('title')
            businessInfo.detail=request.POST.get('detail')
            businessInfo.type=request.POST.get('type')
            businessInfo.addr=request.POST.get('addr')
            businessInfo.addr_value=request.POST.get('addr_value')
            businessInfo.contact=request.POST.get('contact')
            businessInfo.pictures=request.POST.get('pictures')
            businessInfo.save()
            
            user.userprofile.business_nums+=1
            user.userprofile.contribution+=configure.BUSINESS_CONTRIBUTION
            user.userprofile.save()
            
            result='/business/'+str(businessInfo.id)+'/'
            return HttpResponseRedirect(result)
                
class BusinessReviseView(generic.ListView):
    login_url='/'
    template_name='question/t_business_post.html'
    def get_queryset(self):
        return
    def get(self,request,*args,**kwargs):
        ua=request.META['HTTP_USER_AGENT']
        is_mobile=ua.upper().find('MOBILE')>=0
        print('is moblie:',is_mobile)
        if is_mobile:
            self.template_name='question/t_business_post_mobile.html'
        user=request.user
        business_id=self.kwargs.get('business_id')
        if user.is_authenticated:
            businessInfos=BusinessInfo.objects.filter(pk=business_id).values("id","title","detail","type","addr","addr_value","contact","pictures","pub_date","update_date","poster__id","poster__first_name","poster__userprofile__avatar","poster__userprofile__mood",'poster__userprofile__sexual')
            if businessInfos:   
                businessInfo=businessInfos[0]
                if(user.id==businessInfo['poster__id']):
                    return render(request,self.template_name,{'logged':'true','revise':'true','businessInfo':businessInfo})
                else:
                    return HttpResponseRedirect('/business/')
            else:
                return HttpResponseRedirect('/business/')
        else:
            return HttpResponseRedirect('/signinup/?next=/business/revise/'+business_id+'/')
    def post(self,request,*args,**kwargs):
        user=request.user
        business_id=self.kwargs.get('business_id')
        if not user.is_authenticated:
            return HttpResponseRedirect('/signinup/?next=/business/revise/'+business_id+'/')
        else:
            businessInfo=get_object_or_404(BusinessInfo,pk=business_id)
            if businessInfo and businessInfo.poster.id==user.id:
                businessInfo.title=request.POST.get('title')
                businessInfo.detail=request.POST.get('detail')
                businessInfo.type=request.POST.get('type')
                businessInfo.addr=request.POST.get('addr')
                businessInfo.addr_value=request.POST.get('addr_value')
                businessInfo.contact=request.POST.get('contact')
                businessInfo.pictures=request.POST.get('pictures')
                businessInfo.save()
                result='/business/'+str(businessInfo.id)+'/'
                return HttpResponseRedirect(result)
            else:
                return HttpResponseRedirect('/business/')