from django.contrib import admin
from .models import Pedido, DetallePedido

class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 0

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
            "id",
            "mesa",
            "mozo",
            "estado",
            "total",
            "fecha",
            )

    list_filter = (
            "estado",
            )

    ordering = (
            "-fecha",
            )

    inlines = [
            DetallePedidoInline
            ]
