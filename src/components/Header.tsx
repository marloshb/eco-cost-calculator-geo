
import { Leaf, Globe, Calculator } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-eco rounded-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-eco bg-clip-text text-transparent">
                Calculadora Ambiental
              </h1>
              <p className="text-sm text-muted-foreground">
                Valoração de Serviços Ecossistêmicos com Geoprocessamento
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Brasil • CNAE 2023</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calculator className="h-4 w-4" />
              <span>Economia Ecológica</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
