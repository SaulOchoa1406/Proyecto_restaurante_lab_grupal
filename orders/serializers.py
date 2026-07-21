from rest_framework import serializers

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
            "pedido",
            "producto",
            "producto_id",
            "cantidad",
            "precio_unitario",
            "subtotal",
        ]

        read_only_fields = [
            "precio_unitario",
            "subtotal",
        ]

class PedidoSerializer(serializers.ModelSerializer):

    detalles = DetallePedidoSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Pedido

        fields = [
            "id",
            "mesa",
            "mozo",
            "cliente_nombre",
            "cliente_dni",
            "fecha",
            "estado",
            "total",
            "detalles",
        ]

        read_only_fields = [
            "mozo",
            "fecha",
            "total",
        ]
