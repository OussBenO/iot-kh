from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import SensorData

@csrf_exempt
def update_sensor_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            temperature = data.get('temperature')
            humidity = data.get('humidity')

            if temperature is not None and humidity is not None:
                SensorData.objects.create(temperature=temperature, humidity=humidity)
                return JsonResponse({"message": "Donnees recues avec succes"}, status=200)
            else:
                return JsonResponse({"message": "Donnees invalides"}, status=400)
        except Exception as e:
            return JsonResponse({"message": f"Erreur : {str(e)}"}, status=400)
    return JsonResponse({"message": "Methode non autorisee"}, status=405)

@csrf_exempt
def get_sensor_data(request):
    all_data = SensorData.objects.all().values()
    return JsonResponse({"data": list(all_data)}, status=200)

# Ajoutez une vue pour l'accueil
def home(request):
    return JsonResponse({"message": "Bienvenue sur l'API IoT Server !"})
