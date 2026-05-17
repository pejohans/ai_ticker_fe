## Inledning
AI Ticker FE är ett front-end projekt som finns till för att hämta 
prediktioner för aktier. Inte exakta aktiepriser utan mer ett spann och
vart aktiepriset troligtvis kommer att landa utifrån en given tidshorisont. 

Nedan beskrivs dels hur man installerar och kör denna front-end applikation dels dess signifikanta delar. 


## Repostruktur
1. src - I rooten ligger sådant som main och app.tsx som utgör vårt UI. Vi har även css-style sheets och datatypen som returneras av vårt FastAPI.

2. src/api - Innehåller api:er för att koppla upp oss mot externa tjänster

3. src/components - Innehåller komponenter som används i vår React-applikation/UI

4. src/data - Innehåller information/data som vi använder oss av i appen. Just nu innehåller den en lista med aktier.



## Signifikanta delar
1. src/App.tsx - Detta är själva front-end-koden

2. src/index.css - Det style-sheet som används av main.tsx/App.tsx och som stylar själva applikationen

3. src/api/predictionApi.ts - Denna klass kopplar upp sig mot vårt FastAPI för att hämta en prediktion för en aktie.

4. src/types.ts - Denna fil innehåller kontraktet för en aktieprediktion. När vi ställer en fråga till vårt FastAPI så förväntar vi oss den information som står specificerad i filen. 

5. src/.env - Denna fil, med tanke på Python och dess .env kan verka lite förvirrande. Men, i detta sammanhang har det inget med Python att göra. 
.env filen innehåller enbart en sökväg till vårt FastAPI och som används av vårt api/predictionApi.ts för att hämta prediktioner.

6. src/data/omx30.ts - Denna innehåller en lista med alla aktier för OMX30 och som används för att användaren ska kunna välja aktier i gränssnittet.


## Förkrav
För att kunna köra igång applikationen så behöver du installera följande bibliotek.

1. Börja med att installera node version manager (nvm)
2. Installera korrekt node-version 22.12.0 
2:1. nvm install 22.12.0
2:2. nvm use 22.12.0

3. npm install axios - Axios är ett bibliotek för att göra HTTP-anrop (GET, POST etc). Vilket vi behöver för att kunna koppla upp oss mot vårt FastAPI
som gör aktie-prediktioner åt oss.

4. npm install -D vite-plugin-pwa - Ett plugin som gör din React-app till en PWA (Progressive Web App). 
Detta innebär:
2:1. appen kan installeras på mobil
2:2. offline-stöd
2:3. service worker genereras automatiskt
2:4. web app manifest skapas

## Deployment
Denna del är inte klar ännu, men vi kan köra applikationen lokalt just nu.
Men, kort kan sägas att man deloyar denna till en sk. Static Webb application
i Azure. På det viset tillgängliggör vi applikationen både i webbläsaren och på mobilen. 


## Kör igång appen lokalt
1. I projektet, öppna terminalfönster i visual studio code 
2. Kör "npm run dev"
3. Följ den länk som presenteras i terminalfönstret, 
t ex https://localhost:5173
4. En webbläsare öppnas med appen.
5. För att avsluta appen, tryck på bokstaven 'q' för Quit.
