from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.rol = User.Roles.MOZO
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'rol')

class StaffUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    rol = serializers.ChoiceField(
            choices = [
                User.Roles.MOZO,
                User.Roles.COCINERO,
            ]
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'rol')

    def create(self, validate_date):
        password = validate_date.pop('password')
        user = User(**validate_date)
        user.set_password(password)
        user.save()
        return user