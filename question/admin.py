from django.contrib import admin
from django.contrib.auth.models import User
from .models import *

# Register your models here.
class ProfileInline(admin.StackedInline):
    model=UserProfile
    verbose_name='profile'

class UserAdmin(admin.ModelAdmin):
    inlines=[ProfileInline,]

admin.site.unregister(User)
admin.site.register(User,UserAdmin)
admin.site.register(Question)
admin.site.register(Topic)
admin.site.register(Answer)
admin.site.register(Article)
admin.site.register(AnswerComment)
admin.site.register(ArticleComment)
admin.site.register(UserProfile)
admin.site.register(Invite)
admin.site.register(Conversation)
admin.site.register(Notification)
admin.site.register(Message)