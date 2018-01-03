from django.contrib import admin
from django.contrib.auth.models import User
from .models import Question,Topic,Answer,Comment,UserProfile,Invite,Conversation

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
admin.site.register(Comment)
admin.site.register(UserProfile)
admin.site.register(Invite)
admin.site.register(Conversation)