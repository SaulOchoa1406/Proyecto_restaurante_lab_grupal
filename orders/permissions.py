from rest_framework import permissions
from accounts.models import Usuario


class PedidoPermission(permissions.BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.method == "DELETE":
            return request.user.rol == Usuario.Roles.ADMIN

        if request.method == "POST":
            return request.user.rol in (Usuario.Roles.ADMIN, Usuario.Roles.MOZO)

        return True

    def has_object_permission(self, request, view, obj):

        user = request.user

        if user.rol == Usuario.Roles.ADMIN:
            return True

        if user.rol == Usuario.Roles.MOZO:
            return obj.mozo == user

        # COCINERO: puede ver y cambiar el estado de cualquier pedido
        return True


class DetallePedidoPermission(permissions.BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.rol in (Usuario.Roles.ADMIN, Usuario.Roles.MOZO)

    def has_object_permission(self, request, view, obj):

        user = request.user

        if user.rol == Usuario.Roles.ADMIN:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        if user.rol != Usuario.Roles.MOZO:
            return False

        return (
            obj.pedido.mozo == user and
            obj.pedido.estado == obj.pedido.Estados.PENDIENTE
        )