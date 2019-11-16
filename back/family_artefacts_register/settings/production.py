"""
In production we want to allow only the server it's hosted on allowed
to make requests.

We want to use AWS as static and media file storage and not local
We also want to use the DB that's hosted on heroku.

Author: Kyle Zsembery, Zhuoping Miao
"""

import os
from .base import *
import dj_database_url
DEBUG = True

# NEEDS TO BE STORED AS ENV VAR
SECRET_KEY = env('SECRET_KEY')
# SECRET_KEY = '1y3zcu)8516zgu9*^d)6siy6+y2qys=%emm(3+#u3*=6h#$e%u'



# Just for testing, replaced by heroku url
ALLOWED_HOSTS = ["glacial-caverns-32653.herokuapp.com",
                 "glacial-caverns-32653.herokuapp.com/graphql/"]

INSTALLED_APPS += [
    # Amazon AWS
    'storages',
]

DATABASES = {}
DATABASES['default'] = dj_database_url.config(conn_max_age=600)

# Artefacts Picture (AWS S3)

# AWS_ACCESS_KEY_ID = 'AKIARVLDMTEQV22SWEWB'
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
# AWS_SECRET_ACCESS_KEY = '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'
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
AWS_STORAGE_BUCKET_NAME = 'artefact-picture'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

AWS_LOCATION = 'static'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)

DEFAULT_FILE_STORAGE = 'family_artefacts_register.storage_backends.MediaStorage'
