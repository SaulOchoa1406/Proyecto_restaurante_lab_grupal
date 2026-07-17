from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):

    class Roles(models.TextChoices):
        MOZO = "MOZO", "Mozo"
        COCINERO = "COCINERO", "Cocinero"
        ADMIN = "ADMIN", "Administrador"

    rol = models.CharField(
            max_length=20,
            choices=Roles.choices,
            default=Roles.MOZO
    )

    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
