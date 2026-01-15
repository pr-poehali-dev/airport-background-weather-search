import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Flight {
  flightNumber: string;
  airline: string;
  airport: string;
  icao: string;
  time: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived';
  gate?: string;
}

interface MetarData {
  icao: string;
  raw: string;
  temperature: string;
  dewpoint: string;
  wind: string;
  visibility: string;
  pressure: string;
  conditions: string;
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [icaoCode, setIcaoCode] = useState('');
  const [metarData, setMetarData] = useState<MetarData | null>(null);
  const [searchIcao, setSearchIcao] = useState('');

  const departures: Flight[] = [
    { flightNumber: 'SU 1234', airline: 'Аэрофлот', airport: 'Санкт-Петербург', icao: 'ULLI', time: '14:30', status: 'On Time', gate: 'A12' },
    { flightNumber: 'S7 5678', airline: 'S7 Airlines', airport: 'Новосибирск', icao: 'UNNT', time: '15:15', status: 'Boarding', gate: 'B7' },
    { flightNumber: 'U6 9012', airline: 'Уральские авиалинии', airport: 'Екатеринбург', icao: 'USSS', time: '16:00', status: 'Delayed', gate: 'C3' },
    { flightNumber: 'DP 3456', airline: 'Победа', airport: 'Сочи', icao: 'URSS', time: '16:45', status: 'On Time', gate: 'D15' },
  ];

  const arrivals: Flight[] = [
    { flightNumber: 'SU 2468', airline: 'Аэрофлот', airport: 'Казань', icao: 'UWKD', time: '13:45', status: 'Arrived', gate: 'A5' },
    { flightNumber: 'S7 8024', airline: 'S7 Airlines', airport: 'Владивосток', icao: 'UHWW', time: '14:20', status: 'On Time', gate: 'B12' },
    { flightNumber: 'U6 1357', airline: 'Уральские авиалинии', airport: 'Краснодар', icao: 'URKK', time: '15:05', status: 'On Time', gate: 'C8' },
    { flightNumber: 'DP 7890', airline: 'Победа', airport: 'Калининград', icao: 'UMKK', time: '15:50', status: 'On Time', gate: 'D2' },
  ];

  const handleMetarSearch = () => {
    if (!icaoCode.trim()) return;
    
    setMetarData({
      icao: icaoCode.toUpperCase(),
      raw: `METAR ${icaoCode.toUpperCase()} 151200Z 27015KT 9999 FEW020 SCT040 12/08 Q1015 NOSIG`,
      temperature: '12°C',
      dewpoint: '8°C',
      wind: '270° at 15 kt',
      visibility: '10+ km',
      pressure: '1015 hPa',
      conditions: 'Few clouds at 2000ft, Scattered at 4000ft'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Boarding': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Delayed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Departed': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Arrived': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredDepartures = searchIcao 
    ? departures.filter(f => f.icao.toLowerCase().includes(searchIcao.toLowerCase()) || 
                             f.airport.toLowerCase().includes(searchIcao.toLowerCase()))
    : departures;

  const filteredArrivals = searchIcao
    ? arrivals.filter(f => f.icao.toLowerCase().includes(searchIcao.toLowerCase()) || 
                           f.airport.toLowerCase().includes(searchIcao.toLowerCase()))
    : arrivals;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: 'url(https://cdn.poehali.dev/projects/dcfc27cd-7f98-444d-adcb-9cba54599787/files/75a000f7-8635-41b2-bb7a-4829620cfb45.jpg)',
          filter: 'brightness(0.7) contrast(1.2)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />

      <div className="relative z-10">
        <nav className="border-b border-border/50 backdrop-blur-md bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg border border-primary/30">
                  <Icon name="Plane" className="text-primary" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">AeroMetar</h1>
                  <p className="text-xs text-muted-foreground font-mono">Aviation Weather & Flight Info</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={currentSection === 'home' ? 'default' : 'ghost'}
                  onClick={() => setCurrentSection('home')}
                  className="gap-2"
                >
                  <Icon name="Home" size={18} />
                  Главная
                </Button>
                <Button 
                  variant={currentSection === 'weather' ? 'default' : 'ghost'}
                  onClick={() => setCurrentSection('weather')}
                  className="gap-2"
                >
                  <Icon name="CloudRain" size={18} />
                  Погода
                </Button>
                <Button 
                  variant={currentSection === 'airlines' ? 'default' : 'ghost'}
                  onClick={() => setCurrentSection('airlines')}
                  className="gap-2"
                >
                  <Icon name="Building2" size={18} />
                  Авиакомпании
                </Button>
                <Button 
                  variant={currentSection === 'contacts' ? 'default' : 'ghost'}
                  onClick={() => setCurrentSection('contacts')}
                  className="gap-2"
                >
                  <Icon name="Mail" size={18} />
                  Контакты
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {currentSection === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-4 py-12">
                <h2 className="text-5xl font-bold tracking-tight">Добро пожаловать в AeroMetar</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Профессиональная система мониторинга погоды и расписания полётов
                </p>
              </div>

              <Card className="border-primary/30 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Icon name="Search" className="text-primary" />
                    Поиск по аэропортам
                  </CardTitle>
                  <CardDescription>Введите ICAO код или название аэропорта</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Например: UUEE, UWWW, URSS"
                      value={searchIcao}
                      onChange={(e) => setSearchIcao(e.target.value)}
                      className="font-mono text-lg bg-background/50"
                    />
                    <Button onClick={() => setSearchIcao('')} variant="outline">
                      Сбросить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="departures" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="departures" className="gap-2 text-base">
                    <Icon name="PlaneTakeoff" size={20} />
                    Вылеты
                  </TabsTrigger>
                  <TabsTrigger value="arrivals" className="gap-2 text-base">
                    <Icon name="PlaneLanding" size={20} />
                    Прилёты
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="departures" className="space-y-4 mt-6">
                  {filteredDepartures.map((flight) => (
                    <Card key={flight.flightNumber} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold font-mono">{flight.time}</div>
                              <div className="text-xs text-muted-foreground">LOCAL</div>
                            </div>
                            
                            <div className="h-12 w-px bg-border" />
                            
                            <div>
                              <div className="font-semibold text-lg">{flight.flightNumber}</div>
                              <div className="text-sm text-muted-foreground">{flight.airline}</div>
                            </div>
                            
                            <Icon name="ArrowRight" className="text-muted-foreground" size={24} />
                            
                            <div>
                              <div className="font-semibold text-lg">{flight.airport}</div>
                              <div className="text-sm text-muted-foreground font-mono">{flight.icao}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {flight.gate && (
                              <div className="text-center bg-muted/50 px-4 py-2 rounded-lg">
                                <div className="text-xs text-muted-foreground">GATE</div>
                                <div className="font-bold text-lg font-mono">{flight.gate}</div>
                              </div>
                            )}
                            <Badge className={`px-4 py-2 text-sm font-semibold ${getStatusColor(flight.status)}`}>
                              {flight.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="arrivals" className="space-y-4 mt-6">
                  {filteredArrivals.map((flight) => (
                    <Card key={flight.flightNumber} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold font-mono">{flight.time}</div>
                              <div className="text-xs text-muted-foreground">LOCAL</div>
                            </div>
                            
                            <div className="h-12 w-px bg-border" />
                            
                            <div>
                              <div className="font-semibold text-lg">{flight.flightNumber}</div>
                              <div className="text-sm text-muted-foreground">{flight.airline}</div>
                            </div>
                            
                            <Icon name="ArrowLeft" className="text-muted-foreground" size={24} />
                            
                            <div>
                              <div className="font-semibold text-lg">{flight.airport}</div>
                              <div className="text-sm text-muted-foreground font-mono">{flight.icao}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {flight.gate && (
                              <div className="text-center bg-muted/50 px-4 py-2 rounded-lg">
                                <div className="text-xs text-muted-foreground">GATE</div>
                                <div className="font-bold text-lg font-mono">{flight.gate}</div>
                              </div>
                            )}
                            <Badge className={`px-4 py-2 text-sm font-semibold ${getStatusColor(flight.status)}`}>
                              {flight.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentSection === 'weather' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="text-center space-y-2 py-8">
                <h2 className="text-4xl font-bold">METAR Погода</h2>
                <p className="text-muted-foreground">Актуальные метеорологические данные для аэропортов</p>
              </div>

              <Card className="border-primary/30 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" className="text-primary" />
                    Поиск METAR по ICAO коду
                  </CardTitle>
                  <CardDescription>Введите 4-буквенный код аэропорта (например: UUEE для Шереметьево)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="ICAO код (UUEE, UWWW, URSS...)"
                      value={icaoCode}
                      onChange={(e) => setIcaoCode(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="font-mono text-lg bg-background/50"
                    />
                    <Button onClick={handleMetarSearch} className="gap-2 px-8">
                      <Icon name="Search" size={20} />
                      Найти
                    </Button>
                  </div>

                  {metarData && (
                    <div className="space-y-4 pt-4 animate-fade-in">
                      <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                        <div className="text-xs text-muted-foreground mb-2">RAW METAR</div>
                        <div className="font-mono text-sm">{metarData.raw}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Thermometer" className="text-accent" size={20} />
                              <div className="text-xs text-muted-foreground">Температура</div>
                            </div>
                            <div className="text-2xl font-bold">{metarData.temperature}</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Wind" className="text-primary" size={20} />
                              <div className="text-xs text-muted-foreground">Ветер</div>
                            </div>
                            <div className="text-lg font-semibold">{metarData.wind}</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Eye" className="text-emerald-400" size={20} />
                              <div className="text-xs text-muted-foreground">Видимость</div>
                            </div>
                            <div className="text-lg font-semibold">{metarData.visibility}</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Gauge" className="text-blue-400" size={20} />
                              <div className="text-xs text-muted-foreground">Давление</div>
                            </div>
                            <div className="text-lg font-semibold">{metarData.pressure}</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Droplets" className="text-blue-300" size={20} />
                              <div className="text-xs text-muted-foreground">Точка росы</div>
                            </div>
                            <div className="text-lg font-semibold">{metarData.dewpoint}</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-background/50 col-span-2 md:col-span-1">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Cloud" className="text-gray-400" size={20} />
                              <div className="text-xs text-muted-foreground">Облачность</div>
                            </div>
                            <div className="text-sm font-semibold">{metarData.conditions}</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 'airlines' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="text-center space-y-2 py-8">
                <h2 className="text-4xl font-bold">Авиакомпании России</h2>
                <p className="text-muted-foreground">Основные перевозчики страны</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl">Аэрофлот</CardTitle>
                    <CardDescription>Флагманский перевозчик России</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IATA код:</span>
                        <span className="font-mono font-semibold">SU</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICAO код:</span>
                        <span className="font-mono font-semibold">AFL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Позывной:</span>
                        <span className="font-semibold">AEROFLOT</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl">S7 Airlines</CardTitle>
                    <CardDescription>Крупнейшая частная авиакомпания</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IATA код:</span>
                        <span className="font-mono font-semibold">S7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICAO код:</span>
                        <span className="font-mono font-semibold">SBI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Позывной:</span>
                        <span className="font-semibold">SIBERIAN AIRLINES</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl">Уральские авиалинии</CardTitle>
                    <CardDescription>Базируется в Екатеринбурге</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IATA код:</span>
                        <span className="font-mono font-semibold">U6</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICAO код:</span>
                        <span className="font-mono font-semibold">SVR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Позывной:</span>
                        <span className="font-semibold">SVERDLOVSK AIR</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl">Победа</CardTitle>
                    <CardDescription>Лоукостер группы Аэрофлот</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IATA код:</span>
                        <span className="font-mono font-semibold">DP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICAO код:</span>
                        <span className="font-mono font-semibold">PBD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Позывной:</span>
                        <span className="font-semibold">POBEDA</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentSection === 'contacts' && (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
              <div className="text-center space-y-2 py-8">
                <h2 className="text-4xl font-bold">Контакты</h2>
                <p className="text-muted-foreground">Свяжитесь с нами</p>
              </div>

              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Mail" className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Email</div>
                      <div className="text-muted-foreground">info@aerometar.ru</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Phone" className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Телефон</div>
                      <div className="text-muted-foreground">+7 (495) 123-45-67</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="MapPin" className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Адрес</div>
                      <div className="text-muted-foreground">Москва, Шереметьевское шоссе, д. 1</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Clock" className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Режим работы</div>
                      <div className="text-muted-foreground">24/7 - Круглосуточно</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <footer className="border-t border-border/50 backdrop-blur-md bg-background/80 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Plane" className="text-primary" size={20} />
              <span className="font-semibold">AeroMetar</span>
            </div>
            <p className="text-sm">© 2026 Aviation Weather & Flight Information System</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;