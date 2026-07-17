from django.db import models
from django.conf import settings
from tables.models import Mesa
from inventory.models import Producto
from decimal import Decimal
from django.db.models import Sum
from django.core.exceptions import ValidationError

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
        
    def clean(self):

        pedidos_abiertos = Pedido.objects.filter(
                mesa=self.mesa,
                estado__in=[
                    self.Estados.PENDIENTE,
                    self.Estados.EN_PREPARACION,
                    self.Estados.LISTO,
                    self.Estados.ENTREGADO
                    ]
                )

        if self.pk:
            pedidos_abiertos = pedidos_abiertos.exclude(pk=self.pk)

        if pedidos_abiertos.exists():
            raise ValidationError(
                    "Esta mesa ya tiene un pedido activo."
                    )

    def __str__(self):
        return f"Pedido #{self.id}"

    def actualizar_total(self):

        total = self.detalles.aggregate(
                total=Sum("subtotal")
                )["total"] or Decimal("0.00")

        self.total = total
        self.save(update_fields=["total"])

    def save(self, *args, **kwargs):

        self.full_clean()

        super().save(*args, **kwargs)

        if self.estado in [
                self.Estados.PAGADO,
                self.Estados.CANCELADO
                ]:
            self.mesa.ocupada = False

        else:

            self.mesa.ocupada = True

        self.mesa.save(update_fields=["ocupada"])


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

    def save(self, *args, **kwargs):

        self.subtotal = self.cantidad * self.precio_unitario

        super().save(*args, **kwargs)

        self.pedido.actualizar_total()


    def delete(self, *args, **kwargs):

        pedido = self.pedido

        super().delete(*args, **kwargs)

        pedido.actualizar_total()


    def __str__(self):
        return f"{self.producto.nombre} x{self.cantidad}"
