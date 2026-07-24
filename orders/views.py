from django.template.context_processors import request
from rest_framework import viewsets, permissions

from .models import Pedido, DetallePedido
from .serializers import PedidoSerializer, DetallePedidoSerializer
from .permissions import PedidoPermission, DetallePedidoPermission
from accounts.models import Usuario

from rest_framework.exceptions import PermissionDenied


class PedidoViewSet(viewsets.ModelViewSet):

    serializer_class = PedidoSerializer
    permission_classes = [PedidoPermission]


    def get_queryset(self):

        usuario = self.request.user

        # Cada mozo solo ve sus propios pedidos
        if usuario.rol == "MOZO":
            return Pedido.objects.filter(mozo=usuario).order_by("-fecha")


        # Administrador y cocinero pueden ver todos
        return Pedido.objects.all().order_by("-fecha")


    def perform_create(self, serializer):
        serializer.save(mozo=self.request.user)


class DetallePedidoViewSet(viewsets.ModelViewSet):

    serializer_class = DetallePedidoSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):

        usuario = self.request.user

        if usuario.rol == "MOZO":

            return DetallePedido.objects.filter(
                pedido__mozo=usuario
            )

        return DetallePedido.objects.all()


    def perform_create(self, serializer):

        pedido = serializer.validated_data["pedido"]
        user = self.request.user

        if user.rol == Usuario.Roles.MOZO:
            if pedido.mozo != user:
                raise PermissionDenied("No puedes modificar un pedido de otro mozo.")

            if pedido.estado != Pedido.Estados.PENDIENTE:
                raise PermissionDenied("Solo puedes agregar productos mientras el pedido está pendiente.")

        serializer.save()
