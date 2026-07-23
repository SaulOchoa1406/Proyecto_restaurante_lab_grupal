from rest_framework import serializers

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
