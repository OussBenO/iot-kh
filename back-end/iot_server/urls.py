from django.contrib import admin
from django.urls import path, include
from sensor.views import home  # Import de la vue home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('sensor.urls')),  # URLs pour les endpoints de l'API
    path('', home, name='home'),  # Route pour la page d'accueil
]
