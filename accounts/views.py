from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {
                    "detail": "Sesión cerrada correctamente."
                },
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception:

            return Response(
                {
                    "detail": "Token inválido."
                },
                status=status.HTTP_400_BAD_REQUEST
            )