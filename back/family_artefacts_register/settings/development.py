from .base import *

DEBUG=True

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(IT_PROJ_DIR, 'front/build/static'),
    # os.path.join(BASE_DIR, 'family_artefacts_register/stati'),
    
]
