
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Trash2 } from 'lucide-react';

interface MapContainerProps {
  onAreaCalculated: (area: number, coordinates: [number, number][]) => void;
}

export const MapContainer = ({ onAreaCalculated }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [drawnPolygon, setDrawnPolygon] = useState<any>(null);
  const [manualArea, setManualArea] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      try {
        // Import Leaflet dynamically
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const mapInstance = L.map(mapRef.current).setView([-15.7801, -47.9292], 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(mapInstance);

        // Enable drawing
        const drawnItems = new L.FeatureGroup();
        mapInstance.addLayer(drawnItems);

        // Simple click-based polygon drawing
        let isDrawing = false;
        let currentPolygon: any = null;
        let polygonPoints: [number, number][] = [];

        const startDrawing = () => {
          isDrawing = true;
          polygonPoints = [];
          if (currentPolygon) {
            mapInstance.removeLayer(currentPolygon);
          }
        };

        const finishDrawing = () => {
          if (polygonPoints.length >= 3) {
            // Calculate area using simple algorithm
            const area = calculatePolygonArea(polygonPoints);
            onAreaCalculated(area, polygonPoints);
            
            // Create polygon
            currentPolygon = L.polygon(polygonPoints, {
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.3,
              weight: 3
            }).addTo(mapInstance);
            
            setDrawnPolygon(currentPolygon);
          }
          isDrawing = false;
        };

        mapInstance.on('click', (e: any) => {
          if (isDrawing) {
            polygonPoints.push([e.latlng.lat, e.latlng.lng]);
            
            // Add marker for each point
            L.circleMarker([e.latlng.lat, e.latlng.lng], {
              radius: 5,
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 1
            }).addTo(mapInstance);
            
            // If we have at least 3 points, we can finish
            if (polygonPoints.length >= 3) {
              finishDrawing();
            }
          }
        });

        // Create custom control class
        const DrawControl = L.Control.extend({
          onAdd: function() {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            div.style.backgroundColor = '#22c55e';
            div.style.backgroundImage = 'none';
            div.style.width = '40px';
            div.style.height = '40px';
            div.style.cursor = 'pointer';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.color = 'white';
            div.style.fontSize = '16px';
            div.innerHTML = '✏️';
            div.title = 'Desenhar Polígono';
            
            div.onclick = function() {
              if (!isDrawing) {
                startDrawing();
                div.style.backgroundColor = '#ef4444';
                div.innerHTML = '⏹️';
                div.title = 'Clique no mapa para adicionar pontos (mínimo 3)';
              } else {
                finishDrawing();
                div.style.backgroundColor = '#22c55e';
                div.innerHTML = '✏️';
                div.title = 'Desenhar Polígono';
              }
            };
            
            return div;
          }
        });

        // Add the custom control to the map
        const drawControl = new DrawControl({ position: 'topright' });
        mapInstance.addControl(drawControl);

        setMap(mapInstance);
        setIsMapLoaded(true);
        console.log('Map initialized successfully');

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    // Simple area calculation for polygon (Shoelace formula)
    // This is a simplified version - for production use proper geospatial libraries
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    area = Math.abs(area) / 2;
    
    // Convert to hectares (very rough approximation)
    // 1 degree ≈ 111 km, so 1 square degree ≈ 12321 km² ≈ 1,232,100 ha
    const hectares = area * 1232100;
    
    return hectares;
  };

  const clearMap = () => {
    if (drawnPolygon && map) {
      map.removeLayer(drawnPolygon);
      setDrawnPolygon(null);
      onAreaCalculated(0, []);
    }
  };

  const handleManualAreaSubmit = () => {
    const area = parseFloat(manualArea);
    if (!isNaN(area) && area > 0) {
      onAreaCalculated(area, []);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-forest-600" />
          Definição da Área
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={mapRef} 
          className="h-64 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          {!isMapLoaded && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Carregando mapa...</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={clearMap} 
            variant="outline" 
            size="sm"
            disabled={!drawnPolygon}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="manual-area">Ou insira a área manualmente (hectares):</Label>
          <div className="flex gap-2">
            <Input
              id="manual-area"
              type="number"
              placeholder="Ex: 100"
              value={manualArea}
              onChange={(e) => setManualArea(e.target.value)}
              min="0"
              step="0.01"
            />
            <Button onClick={handleManualAreaSubmit} size="sm">
              Definir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
