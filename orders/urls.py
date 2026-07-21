from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PedidoViewSet, DetallePedidoViewSet


router = DefaultRouter()


router.register(
    "pedidos",
    PedidoViewSet,
    basename="pedidos"
)


router.register(
    "detalles",
    DetallePedidoViewSet,
    basename="detalles"
)


urlpatterns = [
    path("", include(router.urls)),
]
