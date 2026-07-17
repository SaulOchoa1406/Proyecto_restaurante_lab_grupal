from django.db import models

class Categoria(models.Model):

    nombre = models.CharField(
            max_length=100,
            unique=True
            )

    def __str__(self):
        return self.nombre


class Producto(models.Model):

    nombre = models.CharField(max_length=150)

    descripcion = models.TextField(blank=True)

    precio = models.DecimalField(
            max_digits=10,
            decimal_places=2
            )

    categoria = models.ForeignKey(
            Categoria,
            on_delete=models.PROTECT,
            related_name="productos"
            )

    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
