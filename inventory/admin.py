from django.contrib import admin
from .models import Categoria, Producto

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):

    list_display = (
            "nombre",
            )

    ordering = (
            "nombre",
            )


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):

    list_display = (
            "nombre",
            "categoria",
            "precio",
            "activo",
            )

    list_filter = (
            "categoria",
            "activo",
            )

    search_fields = (
            "nombre",
            )

    ordering = (
            "nombre",
            )
