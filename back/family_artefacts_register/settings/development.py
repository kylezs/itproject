"""
In development we want to use our local database, which
is fetched using the .env local file which is not in the
git repo.

The hosts allowed to connect are localhost:3000 ports
i.e. the react development server ports

We also want to just store media files locally.
NB: These are ignored by git

Author: Kyle Zsembery
"""

from .base import *
from datetime import timedelta

DEBUG = True

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BACK_DIR, 'build/static'),
]

CORS_ORIGIN_ALLOW_ALL=True
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
]



# NB: THIS IS NOT SUITABLE FOR PRODUCTION.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'), # docker-compose.yml will be set to have db
        'PORT': '5432'
    }
}
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BACK_DIR, 'media')
