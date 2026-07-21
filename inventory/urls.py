from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoriaViewSet, ProductoViewSet


router = DefaultRouter()

router.register(
    "categorias",
    CategoriaViewSet,
    basename="categorias"
)

router.register(
    "productos",
    ProductoViewSet,
    basename="productos"
)


urlpatterns = [
    path("", include(router.urls)),
]
