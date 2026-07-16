from django.db import models
from django.conf import settings
from tables.models import Mesa
from inventory.models import Producto

class Pedido(models.Model):

    class Estados(models.TextChoices):

        PENDIENTE = "PENDIENTE", "Pendiente"
        EN_PREPARACION = "EN_PREPARACION", "En preparación"
        LISTO = "LISTO", "Listo"
        ENTREGADO = "ENTREGADO", "Entregado"
        PAGADO = "PAGADO", "Pagado"
        CANCELADO = "CANCELADO", "Cancelado"

        mesa = models.ForeignKey(
                Mesa,
                on_delete=models.PROTECT,
                related_name="pedidos"
                )

        mozo = models.ForeignKey(
                settings.AUTH_USER_MODEL,
                on_delete=models.PROTECT,
                related_name="pedidos"
                )

        cliente_nombre = models.CharField(
                max_length=150,
                blank=True
                )

        cliente_dni = models.CharField(
                max_length=8,
                blank=True
                )

        fecha = models.DateTimeField(auto_now_add=True)

        estado = models.CharField(
                max_length=20,
                choices=Estados.choices,
                default=Estados.PENDIENTE
                )

        total = models.DecimalField(
                max_digits=10,
                decimal_places=2,
                default=0
                )

        def __str__(self):
            return f"Pedido #{self.id}"


class DetallePedido(models.Model):

    pedido = models.ForeignKey(
            Pedido,
            on_delete=models.CASCADE,
            related_name="detalles"
            )

    producto = models.ForeignKey(
            Producto,
            on_delete=models.PROTECT
            )

    cantidad = models.PositiveIntegerField(
            default=1
            )

    precio_unitario = models.DecimalField(
            max_digits=8,
            decimal_places=2
            )

    subtotal = models.DecimalField(
            max_digits=10,
            decimal_places=2
            )

    def __str__(self):
        return f"{self.producto.nombre} x{self.cantidad}"
