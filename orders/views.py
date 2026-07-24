from django.http import FileResponse
from django.template.context_processors import request
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Pedido, DetallePedido
from .serializers import PedidoSerializer, DetallePedidoSerializer
from .permissions import PedidoPermission, DetallePedidoPermission
from .pdf import generate_ticket_pdf
from accounts.models import Usuario

from rest_framework.exceptions import PermissionDenied


class PedidoViewSet(viewsets.ModelViewSet):

    serializer_class = PedidoSerializer
    permission_classes = [PedidoPermission]


    def get_queryset(self):

        usuario = self.request.user

        queryset = Pedido.objects.select_related("mesa", "mozo").prefetch_related("detalles__producto__categoria")

        # Cada mozo solo ve sus propios pedidos
        if usuario.rol == Usuario.Roles.MOZO:
            queryset = queryset.filter(mozo=usuario)

        mesa_id = self.request.query_params.get("mesa")
        if mesa_id:
            queryset = queryset.filter(mozo_id=mesa_id)

        estado = self.request.query_params.get("estado")
        if estado:
            queryset = queryset.filter(status=estado)

        return queryset.order_by("-fecha")

    def perform_create(self, serializer):
        serializer.save(mozo=self.request.user)


    @action(detail=True, methods=["post"], url_path="cobrar")
    def charge(self, request, pk=None):

        order = self.get_object()

        is_admin = request.user.rol == Usuario.Roles.ADMIN
        is_su_mozo = (
            request.user.rol == Usuario.Roles.MOZO
            and order.mozo == request.user
        )

        if not (is_admin or is_su_mozo):
            raise PermissionDenied("No puedes cobrar este pedido.")

        if order.estado != Pedido.Estados.ENTREGADO:
            return Response(
                {"detail": "Solo se puede cobrar un pedido que ya fue entregado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.estado = Pedido.Estados.PAGADO
        order.save()

        buffer = generate_ticket_pdf(order)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"boleta_{order.id:06d}.pdf",
            content_type="application/pdf"
        )


class DetallePedidoViewSet(viewsets.ModelViewSet):

    serializer_class = DetallePedidoSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):

        user = self.request.user

        if user.rol == Usuario.Roles.MOZO:

            return DetallePedido.objects.filter(pedido__mozo=user)

        return DetallePedido.objects.all()


    def perform_create(self, serializer):

        order = serializer.validated_data["pedido"]
        user = self.request.user

        if user.rol == Usuario.Roles.MOZO:
            if order.mozo != user:
                raise PermissionDenied("No puedes modificar un pedido de otro mozo.")

            if order.estado != Pedido.Estados.PENDIENTE:
                raise PermissionDenied("Solo puedes agregar productos mientras el pedido está pendiente.")

        serializer.save()
