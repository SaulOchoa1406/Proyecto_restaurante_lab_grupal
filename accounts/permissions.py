from rest_framework import permissions
from .models import Usuario


class IsAdministrador(permissions.BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.rol == Usuario.Roles.ADMIN
        )
