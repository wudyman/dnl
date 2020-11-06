from django.conf.urls import url,include
from . import redirect_views as views

urlpatterns= [
    url(r'^category/(?P<category_str>.+)$',views.RedirectCateView.as_view(),name='RedirectCateView'),
    url(r'^tag/(?P<tag_str>.+)$',views.RedirectTagView.as_view(),name='RedirectTagView'),
    url(r'^(?P<year>[0-9]+)/(?P<month>[0-9]+)/(?P<article_id>[0-9]+).html$',views.RedirectArticleView.as_view(),name='RedirectArticleView'),
]
