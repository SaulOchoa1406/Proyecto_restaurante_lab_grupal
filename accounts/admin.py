from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
            ("información del restaurante", {
                "fields": (
                    "rol",
                    "fecha_registro",
                )
            }),
    )
    readonly_fields = (
            "fecha_registro",
    )


