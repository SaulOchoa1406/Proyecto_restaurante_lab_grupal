from django.db import models

class Mesa(models.Model):
    
    numero = models.PositiveSmallIntegerField(
            unique = True
            )

    ocupada = models.BooleanField(
            default = False
            )

    def __str__(self):
        return f"Mesa {self.numero}"
