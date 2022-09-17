from forier_series import ForierSeries
import json

image = ".svg"
with open("presets.json", "r") as file:
    settings = json.loads(file.read())[image]

series = ForierSeries("paths/svg/" + image, settings)
series.save_constants(image)