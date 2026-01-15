import json
import os
import urllib.request
import urllib.parse
from typing import Optional

def handler(event: dict, context) -> dict:
    '''API для получения реального расписания рейсов по аэропортам через AviationStack'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    airport_name = params.get('airport', '').strip()
    flight_type = params.get('type', 'departure')
    
    if not airport_name:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Airport name is required'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('AVIATIONSTACK_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    airport_iata = get_airport_iata(airport_name)
    if not airport_iata:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Airport not found: {airport_name}'}),
            'isBase64Encoded': False
        }
    
    try:
        url = f'http://api.aviationstack.com/v1/flights?access_key={api_key}'
        
        if flight_type == 'departure':
            url += f'&dep_iata={airport_iata}'
        else:
            url += f'&arr_iata={airport_iata}'
        
        url += '&limit=10'
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        if 'data' not in data:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid API response'}),
                'isBase64Encoded': False
            }
        
        flights = []
        for flight in data['data']:
            flight_info = {
                'flightNumber': flight.get('flight', {}).get('iata', 'N/A'),
                'airline': flight.get('airline', {}).get('name', 'Unknown'),
                'airport': (flight.get('arrival', {}).get('airport', 'Unknown') 
                           if flight_type == 'departure' 
                           else flight.get('departure', {}).get('airport', 'Unknown')),
                'icao': (flight.get('arrival', {}).get('icao', 'N/A') 
                        if flight_type == 'departure' 
                        else flight.get('departure', {}).get('icao', 'N/A')),
                'time': (flight.get('departure', {}).get('scheduled', 'N/A')[-8:-3] 
                        if flight_type == 'departure' 
                        else flight.get('arrival', {}).get('scheduled', 'N/A')[-8:-3]),
                'status': get_flight_status(flight.get('flight_status', 'unknown')),
                'gate': flight.get('departure', {}).get('gate') or flight.get('arrival', {}).get('gate') or 'TBA',
                'registration': flight.get('aircraft', {}).get('registration') or 'N/A',
                'parkingPosition': flight.get('departure', {}).get('terminal') or flight.get('arrival', {}).get('terminal') or 'N/A'
            }
            flights.append(flight_info)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'airport': airport_name,
                'iata': airport_iata,
                'type': flight_type,
                'flights': flights
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def get_airport_iata(airport_name: str) -> Optional[str]:
    airport_map = {
        'толмачёво': 'OVB',
        'толмачево': 'OVB',
        'новосибирск': 'OVB',
        'шереметьево': 'SVO',
        'внуково': 'VKO',
        'домодедово': 'DME',
        'пулково': 'LED',
        'санкт-петербург': 'LED',
        'кольцово': 'SVX',
        'екатеринбург': 'SVX',
        'адлер': 'AER',
        'сочи': 'AER',
        'казань': 'KZN',
        'самара': 'KUF',
        'курумоч': 'KUF',
        'краснодар': 'KRR',
        'пашковский': 'KRR',
        'владивосток': 'VVO',
        'кневичи': 'VVO',
        'иркутск': 'IKT',
        'калининград': 'KGD',
        'храброво': 'KGD',
        'минск': 'MSQ',
        'минск-2': 'MSQ',
    }
    
    return airport_map.get(airport_name.lower())


def get_flight_status(status: str) -> str:
    status_map = {
        'scheduled': 'On Time',
        'active': 'Boarding',
        'landed': 'Arrived',
        'cancelled': 'Cancelled',
        'incident': 'Delayed',
        'diverted': 'Diverted'
    }
    return status_map.get(status.lower(), 'Unknown')
