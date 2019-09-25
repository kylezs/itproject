from .base import *
DEBUG = True

# Deploy backend to heroku
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACK_DIR = os.path.dirname(BASE_DIR)


STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

# STATIC_TMP = os.path.join(BASE_DIR, 'static')
# os.makedirs(STATIC_TMP, exist_ok=True)

# Just for testing, replaced by heroku url
ALLOWED_HOSTS = ['https://family-artefacts-register.herokuapp.com',
                 "*.herokuapp.com", "127.0.0.1:8000",
                 "http://0.0.0.0:5000",
                 "localhost"]

INSTALLED_APPS += [
    # Amazon AWS
    'storages',
]

# Artefacts Picture (AWS S3)

STATICFILES_DIRS = [
   os.path.join(BACK_DIR, 'build/static')
]

# AWS_ACCESS_KEY_ID = 'AKIARVLDMTEQV22SWEWB'
# AWS_SECRET_ACCESS_KEY = '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'
# AWS_STORAGE_BUCKET_NAME = 'artefact-picture'
# AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

# AWS_S3_OBJECT_PARAMETERS = {
#     'CacheControl': 'max-age=86400',
# }

# AWS_LOCATION = 'static'
# STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)

# DEFAULT_FILE_STORAGE = 'family_artefacts_register.storage_backends.MediaStorage'
# """
