from graphene_django import DjangoObjectType
from artefacts.models import Artefact


class ArtefactType(DjangoObjectType):
    class Meta:
        model = Artefact
        only_fields = (
            'id',
            'name',
            'description',
            'added_at',
            
            'date',
            'artifact_flag_choices',
            'is_public',
            'information_on_handling', # test
        )
        # Creates a connection for ArtefactType, to paginate data when we get
        # a list of Artefacts
        use_connection = True

    # Called when client requests a field so we don't end up with old data
    def resolve_is_old(root, *args):
        return root.added_at < (timezone.now() - timezone.timedelta(days=666))
