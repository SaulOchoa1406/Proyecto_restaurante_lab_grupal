from rest_framework import viewsets, permissions

from .models import Mesa
from .serializers import MesaSerializer

from accounts.permissions import IsAdministrador, IsAdminOrReadOnly


class MesaViewSet(viewsets.ModelViewSet):

    queryset = Mesa.objects.all().order_by("numero")
    serializer_class = MesaSerializer
    permission_classes = [IsAdminOrReadOnly]
