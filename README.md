# Room‑Scout (Self‑Contained)

Room‑Scout is a simple full‑stack application for browsing properties, making bookings, and managing data through an admin panel. This self‑contained repository includes:

- Frontend: React (Create React App)
- Backend: Spring Boot (Java 17)
- Email Provider: Spring Boot microservice for outbound email (optional)

By default, the frontend points to a hosted backend so you can run the UI immediately without standing up any servers. You can optionally run the backend and email‑provider locally.


## What this repo is used for

- Quickly preview the Room‑Scout UI and interact with a live API (hosted backend)
- Optionally run backend services locally for development and debugging
- Explore the architecture diagrams in the `Diagrams/` folder


## Repository layout

```
Room-Scout-self-contained/
├─ frontend/                # React webapp (Create React App)
├─ backend/
│  └─ room-scout/           # Spring Boot backend (Eureka server + REST + JPA)
│     ├─ docker/            # Docker Compose to run the backend container (port 8080)
│     └─ src/
├─ email-provider/          # Spring Boot email microservice (port 8089)
└─ Diagrams/                # C1/C2 and component diagrams
```


## Quick start (recommended): Run only the frontend

The frontend is already wired to call a hosted backend at `http://157.173.114.224:8080`. You can run just the UI and immediately interact with the app.

Prerequisites
- Node.js 18+ and npm

Steps (macOS, Linux, Windows PowerShell or CMD)
1) Install dependencies
	 - Command:
		 ```bash
		 cd frontend
		 npm ci
		 ```
	 - Expected outcome:
		 - npm installs dependencies cleanly (you’ll see a summary like “added X packages”).

2) Start the dev server
	 - Command:
		 ```bash
		 npm start
		 ```
	 - Expected outcome:
		 - Terminal shows “Compiled successfully!”
		 - App served at: http://localhost:3000
		 - Browser opens automatically; you can browse properties, log in/register, and use admin features. API calls go to the hosted backend.

You can stop here. The next sections are only if you want to run backend services locally.


## Prerequisites for running backend locally

- Java 17 (JDK)
- Docker Desktop (if running backend via Docker Compose)

Check your environment
- Java:
	- macOS/Linux: `java -version` → should show version 17
	- Windows (PowerShell/CMD): `java -version` → should show version 17
- Docker:
	- `docker --version` → prints Docker version (Docker Desktop must be running)

Install tips (optional)
- macOS (Homebrew):
	- `brew install openjdk@17`
	- `brew install node`
- Windows:
	- Java 17: `winget install --id EclipseAdoptium.Temurin.17.JDK -e`
	- Node.js: `winget install OpenJS.NodeJS.LTS`
	- Docker Desktop: install from https://www.docker.com/products/docker-desktop/
- Ubuntu/Debian (example):
	- Java 17: `sudo apt-get update && sudo apt-get install -y openjdk-17-jdk`
	- Node.js: https://github.com/nodesource/distributions or use nvm


## Important backend note

The backend’s `application.properties` is configured to use remote infrastructure:
- MySQL (remote)
- RabbitMQ (remote)
- Eureka defaultZone (remote)

This means the backend will try to connect to those remote services. If they’re not reachable, the backend will fail to start or return errors on DB/Rabbit operations. This repo does not include a local MySQL/RabbitMQ Compose setup.


## Option A: Run the backend with Docker Compose (port 8080)

1) Build and start the backend container (detached)
	 - Commands:
		 - macOS/Linux:
			 ```bash
			 cd backend/room-scout/docker
			 docker compose up --build -d
			 ```
		 - Windows PowerShell/CMD:
			 ```bat
			 cd backend\room-scout\docker
			 docker compose up --build -d
			 ```
	 - Expected outcome:
		 - Docker builds the Spring Boot image and starts a container.
		 - `docker ps` shows a container mapping `0.0.0.0:8080->8080/tcp`.

2) View logs to confirm startup
	 - Command (all OS):
		 ```bash
		 docker compose logs -f
		 ```
	 - Expected outcome:
		 - You’ll see: “Tomcat started on port(s): 8080” and “Started RoomScoutApplication …”.
		 - If remote DB/RabbitMQ are down/unreachable, logs may show connection errors.

3) Smoke test the API
	 - Commands:
		 - macOS/Linux:
			 ```bash
			 curl -s http://localhost:8080/swagger-ui/index.html | head -n 5
			 ```
		 - Windows PowerShell:
			 ```powershell
			 (Invoke-WebRequest http://localhost:8080/swagger-ui/index.html).Content.Substring(0,500)
			 ```
		 - Windows CMD:
			 ```bat
			 curl http://localhost:8080/swagger-ui/index.html
			 ```
	 - Expected outcome:
		 - HTML content for Swagger UI if the app is healthy on 8080.


## Option B: Run the backend with Gradle (no Docker)

1) Start the Spring Boot app
	 - Commands:
		 - macOS/Linux:
			 ```bash
			 cd backend/room-scout
			 ./gradlew bootRun
			 ```
		 - Windows PowerShell/CMD:
			 ```bat
			 cd backend\room-scout
			 gradlew.bat bootRun
			 ```
	 - Expected outcome:
		 - Build output followed by: “Tomcat started on port(s): 8080” and “Started RoomScoutApplication …”.
		 - If remote dependencies aren’t reachable, you’ll see connection errors.

2) Smoke test
	 - See “Option A → Smoke test the API”.


## Optional: Run the Email Provider (port 8089)

This microservice connects to remote RabbitMQ/Eureka. It’s optional for most UI flows.

1) Start the service
	 - Commands:
		 - macOS/Linux:
			 ```bash
			 cd email-provider
			 ./gradlew bootRun
			 ```
		 - Windows PowerShell/CMD:
			 ```bat
			 cd email-provider
			 gradlew.bat bootRun
			 ```
	 - Expected outcome:
		 - “Tomcat started on port(s): 8089” and “Started … in … seconds”.
		 - If RabbitMQ/Eureka are down, you’ll see connection errors.

2) Port check (macOS/Linux)
	 - Command:
		 ```bash
		 lsof -iTCP:8089 -sTCP:LISTEN -n | grep java || true
		 ```
	 - Expected outcome:
		 - A line indicating Java is listening on 8089.


## Switching the frontend to your local backend (optional)

The frontend currently calls absolute URLs like `http://157.173.114.224:8080/...` in multiple files, so it will keep using the hosted backend even if you run your own backend locally. If you want the UI to talk to your local backend on `http://localhost:8080`, you can temporarily replace those URLs:

- macOS/Linux (in `frontend/`):
	```bash
	cd frontend
	grep -RIl "http://157.173.114.224:8080" src | xargs sed -i '' 's#http://157.173.114.224:8080#http://localhost:8080#g'
	npm start
	```

- Windows PowerShell (in `frontend/`):
	```powershell
	cd frontend
	Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx -Path src | ForEach-Object {
		(Get-Content $_.FullName) -replace 'http://157.173.114.224:8080','http://localhost:8080' | Set-Content $_.FullName
	}
	npm start
	```

Expected outcome
- The app at http://localhost:3000 will now call your local backend at http://localhost:8080.

Tip: For a permanent, maintainable solution, refactor the frontend to read a base API URL from an environment variable (e.g., `REACT_APP_API_BASE`) and centralize axios/fetch calls.


## Smoke tests (end‑to‑end)

1) UI: visit http://localhost:3000
	 - Expected outcome:
		 - App loads and you can browse, login/register, and create bookings.
2) Backend: visit http://localhost:8080/swagger-ui/index.html
	 - Expected outcome:
		 - Swagger UI shows available endpoints (e.g., /properties, /users, /bookings, /roomtypes).


## Shutdown and cleanup

- Frontend (all OS):
	- Press Ctrl+C in the terminal running `npm start` → dev server stops.

- Backend via Docker Compose:
	- Commands:
		- macOS/Linux:
			```bash
			cd backend/room-scout/docker
			docker compose down
			```
		- Windows PowerShell/CMD:
			```bat
			cd backend\room-scout\docker
			docker compose down
			```
	- Expected outcome:
		- Container stopped and removed.

- Backend via Gradle or Email Provider:
	- Press Ctrl+C in their terminals → Spring Boot shuts down gracefully.


## Troubleshooting

- “docker compose up” fails immediately
	- Ensure Docker Desktop is running and you’re in `backend/room-scout/docker`.

- Backend shows DB or RabbitMQ connection errors
	- The backend is configured to remote services. If they’re not reachable, startup will fail or endpoints will error. You’d need to provide reachable services or adjust `application.properties`/environment variables.

- Port already in use (3000/8080/8089)
	- Stop the process using the port, or change the port in configs.

- Java version mismatch
	- Ensure Java 17 is installed and on PATH. `java -version` should show 17.

- Frontend still hitting remote backend after starting a local backend
	- Replace absolute URLs as shown in “Switching the frontend to your local backend”.


---

Happy hacking! If you run into issues, check the logs and the Troubleshooting section above.
