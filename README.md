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


## One‑pass guide: Run the full stack locally (self‑contained)

Follow these steps top‑to‑bottom to run BOTH backend and frontend locally using an in‑memory H2 database. Works on macOS, Windows, and Linux.

0) Prerequisites check (all OS)
- Commands:
	- Check Java 17:
		```bash
		java -version
		```
	- Check Node.js (v18+ recommended):
		```bash
		node -v
		```
- Expected outcome:
	- `java -version` prints version 17.x.
	- `node -v` prints v18.x or newer.
	- If missing, install Java 17 and Node 18+ (see Troubleshooting section).

1) Start the backend (local profile, H2 in‑memory DB)
- macOS/Linux:
	```bash
	cd backend/room-scout
	./gradlew bootRun --args='--spring.profiles.active=local'
	```
- Windows PowerShell/CMD:
	```bat
	cd backend\room-scout
	gradlew.bat bootRun --args="--spring.profiles.active=local"
	```
- Expected outcome:
	- Build completes, logs show:
		- “Tomcat started on port(s): 8080”
		- “Started RoomScoutApplication …”
	- The app uses H2 (no MySQL needed) and does NOT require RabbitMQ or Eureka.
	- Keep this terminal running.

2) Point the frontend to your local backend (one‑time switch)
- The frontend code currently calls the hosted backend via absolute URLs. Replace them to target your local backend on `http://localhost:8080`.
- macOS/Linux:
	```bash
	cd ../../frontend
	grep -RIl "http://157.173.114.224:8080" src | xargs sed -i '' 's#http://157.173.114.224:8080#http://localhost:8080#g'
	```
- Windows PowerShell:
	```powershell
	cd ..\..\frontend
	Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx -Path src | ForEach-Object {
		(Get-Content $_.FullName) -replace 'http://157.173.114.224:8080','http://localhost:8080' | Set-Content $_.FullName
	}
	```
- Expected outcome:
	- All API calls from the UI will go to your local backend on port 8080.

3) Install frontend dependencies
- Commands (all OS):
	```bash
	npm ci
	```
- Expected outcome:
	- npm installs packages cleanly.

4) Start the frontend
- Commands (all OS):
	```bash
	npm start
	```
- Expected outcome:
	- Terminal shows “Compiled successfully!”.
	- App is available at http://localhost:3000 and auto‑opens in your browser.
	- Interactions (login/register, browse, bookings, admin) now hit your local backend.

5) Smoke tests (optional but recommended)
- API docs (Swagger):
	- Open http://localhost:8080/swagger-ui/index.html — you should see the Swagger UI.
- Quick curl (macOS/Linux):
	```bash
	curl -s http://localhost:8080/properties | head -n 5
	```
	- Expected outcome: JSON array or empty list `[]` depending on seed/data.

6) Shutdown
- Frontend: press Ctrl+C in the terminal running `npm start`.
- Backend: press Ctrl+C in the terminal running `bootRun`.

That’s it. You’re running the full stack locally with zero external services.


## Appendix A: Alternative backend start (Docker Compose)

If you prefer Docker, you can run the backend in a container with the local profile enabled:

1) Build and start (detached)
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
	- Container up mapping `8080:8080`.
	- `SPRING_PROFILES_ACTIVE=local` is set in compose (uses H2, no Rabbit/Eureka).

2) Logs and smoke test
- Logs (all OS):
	```bash
	docker compose logs -f
	```
- Swagger UI: http://localhost:8080/swagger-ui/index.html

3) Stop the container
- macOS/Linux:
	```bash
	docker compose down
	```
- Windows PowerShell/CMD:
	```bat
	docker compose down
	```


## Important backend note

The backend’s `application.properties` is configured to use remote infrastructure:
- MySQL (remote)
- RabbitMQ (remote)
- Eureka defaultZone (remote)

This means the backend will try to connect to those remote services. If they’re not reachable, the backend will fail to start or return errors on DB/Rabbit operations.

Self‑contained local profile
- We provide a local Spring profile (`local`) that uses an in‑memory H2 database and disables Eureka/RabbitMQ so you can run everything on your machine without external services.
- Use this profile when running the backend locally (via Gradle or Docker Compose below).


## Appendix B: Quick start (frontend only, uses hosted backend)

If you only want to preview the UI against the hosted backend (no local backend):

1) Install and start
```bash
cd frontend
npm ci
npm start
```
- Expected outcome:
	- App at http://localhost:3000, calling the hosted API.


## Appendix C: Optional — Run the Email Provider (port 8089)

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


## Appendix D: Tips
- For a permanent, maintainable API switch, refactor the frontend to read a base API URL from an env var (e.g., `REACT_APP_API_BASE`) and centralize axios/fetch calls in a single module.


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
