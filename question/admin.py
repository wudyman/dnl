from django.contrib import admin
from .models import Question,Topic,Answer,Comment

# Register your models here.
admin.site.register(Question)
admin.site.register(Topic)
admin.site.register(Answer)
admin.site.register(Comment)
