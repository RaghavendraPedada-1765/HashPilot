import asyncio
import websockets
import requests
import threading
import json

async def listen():
    try:
        async with websockets.connect('ws://127.0.0.1:8000/ws/benchmark') as ws:
            print("Connected to WS")
            
            def trigger_benchmark():
                requests.get('http://127.0.0.1:8000/benchmark?difficulty=3&threads=2&processes=2')
                
            threading.Thread(target=trigger_benchmark).start()
            
            while True:
                msg = await ws.recv()
                print("WS MSG:", msg)
    except Exception as e:
        print("WS ERR:", e)

asyncio.run(listen())
