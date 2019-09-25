from .base import *

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'family_artefacts_register/static'),
    os.path.join(IT_PROJ_DIR, 'front/build/static')
]