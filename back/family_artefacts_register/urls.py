"""family_artefacts_register URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

Author: Kyle Zsembery (configurations of prod and dev)
"""

import os
from django.contrib import admin
from django.conf import settings
from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from django.views.generic import TemplateView
from django.views.static import serve



# Enable graphiql if debug is true
GRAPHIQL = settings.DEBUG

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=GRAPHIQL)))
]
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
        re_path('.*', TemplateView.as_view(template_name='index.html')),
    ]
else:
    urlpatterns += [
        re_path('.*', TemplateView.as_view(template_name='index.html')),
    ]

