from storages.backends.s3boto3 import S3Boto3Storage

## Default file storage
class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False