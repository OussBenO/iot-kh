from django.urls import path
from . import views

urlpatterns = [
    path('update-sensor-data/', views.update_sensor_data, name='update_sensor_data'),
    path('sensor-data/', views.get_sensor_data, name='get_sensor_data'),
    
]
