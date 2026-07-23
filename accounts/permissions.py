from rest_framework import permissions
from .models import Usuario


class IsAdministrador(permissions.BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.rol == Usuario.Roles.ADMIN
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Cualquier usuario autenticado puede leer (list/retrieve).
    Solo el admin puede crear, editar o eliminar.
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.rol == Usuario.Roles.ADMIN