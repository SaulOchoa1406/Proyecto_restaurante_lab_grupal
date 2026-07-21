from rest_framework import viewsets, permissions

from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):

    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductoViewSet(viewsets.ModelViewSet):

    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = Producto.objects.filter(activo=True).order_by("nombre")

        nombre = self.request.query_params.get("search")

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)

        categoria = self.request.query_params.get("categoria")

        if categoria:
            queryset = queryset.filter(categoria_id=categoria)

        return queryset
