#from django.template.context_processors import request
from rest_framework import serializers

from accounts.models import Usuario
from accounts.serializers import UserSerializer
from tables.models import Mesa
from tables.serializers import MesaSerializer
from .models import Pedido, DetallePedido
from inventory.models import Producto
from inventory.serializers import ProductoSerializer


class DetallePedidoSerializer(serializers.ModelSerializer):

    producto = ProductoSerializer(read_only=True)

    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        source="producto",
        write_only=True
    )

    class Meta:
        model = DetallePedido
        fields = [
            "id",
            "order",
            "product",
            "product_id",
            "amount",
            "unit_price",
            "subtotal",
        ]

        read_only_fields = [
            "unit_price",
            "subtotal",
        ]

TRANSITIONS = {
    Usuario.Roles.COCINERO: {
        Pedido.Estados.PENDIENTE: {Pedido.Estados.EN_PREPARACION},
        Pedido.Estados.EN_PREPARACION: {Pedido.Estados.LISTO},
    },
    Usuario.Roles.MOZO: {
        Pedido.Estados.PENDIENTE: {Pedido.Estados.CANCELADO},
        Pedido.Estados.LISTO: {Pedido.Estados.ENTREGADO},
        Pedido.Estados.ENTREGADO: {Pedido.Estados.ENTREGADO},
    },
}


class PedidoSerializer(serializers.ModelSerializer):

    mesa = MesaSerializer(read_only=True)

    mesa_id = serializers.PrimaryKeyRelatedField(
        queryset=Mesa.objects.all(),
        source="mesa",
        write_only=True
    )

    mozo = UserSerializer(read_only=True)

    detalles = DetallePedidoSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Pedido

        fields = [
            "id",
            "table",
            "waiter",
            "customer_name",
            "customer_dni",
            "date",
            "status",
            "total",
            "details",
        ]

        read_only_fields = [
            "waiter",
            "date",
            "total",
        ]

    def validate_state(self, value):
        request = self.context.get("request")
        user = request.user

        if user.rol == Usuario.Roles.ADMIN:
            return value

        if self.instance is None:
            if value != Pedido.Estados.PENDIENTE:
                raise serializers.ValidationError(
                    "Un pedido nuevo debe iniciar en estado PENDIENTE."
                )
            return value

        estado_actual = self.instance.estado

        if value == estado_actual:
            return value

        destinos_validos = TRANSITIONS.get(user.rol, {}).get(estado_actual, set())

        if value not in destinos_validos:
            raise serializers.ValidationError(
                f"Tu rol no puede cambiar el pedido de {estado_actual} a {value}."
            )

        return value

    def validate(self, attrs):

        request = self.context.get("request")
        user = getattr(request, "user", None)

        if user and user.rol == Usuario.Roles.COCINERO and self.instance:
            campos_no_estado = [
                campo for campo in attrs
                if campo != "estado" and attrs[campo] != getattr(self.instance, campo)
            ]
            if campos_no_estado:
                raise serializers.ValidationError(
                    "El cocinero solo puede actualizar el estado del pedido."
                )

        return attrs